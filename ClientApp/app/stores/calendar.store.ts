import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';
import * as startOfWeek from 'date-fns/start_of_week';
import * as endOfWeek from 'date-fns/end_of_week';
import * as isSameWeek from 'date-fns/is_same_week';

import { AddWorkerOption } from '../models/shared/calendar-options';
import { environment } from '../../environments/environment';
import { CalendarService } from '../services/calendar.service';
import { CalendarDay, CalendarJob, DayView, Worker, MoveWorkerRequestModel, AddJobModel } from '../components/calendar/common/models';
import { isSameDay, subDays } from 'date-fns';
import { JobService } from '../services/job.service';

@Injectable()
export class CalendarStore {
    
    private _lastViewDate: Date;

    private _monthData: BehaviorSubject<List<DayView>> = new BehaviorSubject(List([]));
    
    private _weekData: BehaviorSubject<List<DayView>> = new BehaviorSubject(List([]));

    private _dayData: BehaviorSubject<DayView> = new BehaviorSubject(new DayView(new CalendarDay(new Date(), false, false, false, false, false), [], [], []));

    public monthErrorMessage: string;

    public hasMonthError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isMonthLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public weekErrorMessage: string;

    public hasWeekError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isWeekLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public dayErrorMessage: string;

    public hasDayError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isDayLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly monthData: Observable<List<DayView>> = this._monthData.asObservable();

    public readonly weekData: Observable<List<DayView>> = this._weekData.asObservable();

    public readonly dayData: Observable<DayView> = this._dayData.asObservable();

    constructor(
        private calendarService: CalendarService,
        private jobService: JobService
    ) {
    }

    public addJobToWeekView(addJobModel: AddJobModel){
        var obs = this.jobService.addJob(addJobModel);

        obs.subscribe( response => { 
            this.getDataForWeek(this._lastViewDate);
        }, error => {
            console.log(error);
        });

        return obs;
    }

    public addJobToDayView(addJobModel: AddJobModel){
        var obs = this.jobService.addJob(addJobModel);

        obs.subscribe( response => { 
            this.getDataForDay(this._lastViewDate);
        }, error => {
        });

        return obs;
    }

    public editJobFromWeekView(jobId: string, addJobModel: AddJobModel){
        var obs = this.jobService.editJob(jobId, addJobModel);

        obs.subscribe( response => { 
            this.getDataForWeek(this._lastViewDate);                    
        }, error => {
        });

        return obs;
    }

    public editJobFromDayView(jobId: string, addJobModel: AddJobModel){
        var obs = this.jobService.editJob(jobId, addJobModel);

        obs.subscribe( response => { 
            this.getDataForDay(this._lastViewDate);                    
        }, error => {
        });

        return obs;
    }

    public deleteJobFromWeekView(jobId: string){
        var obs = this.jobService.deleteJob(jobId);

        obs.subscribe( response => {
            this.getDataForWeek(this._lastViewDate);
        }, error => {
        })
        
        return obs;
    }

    public deleteJobFromDayView(jobId: string){
        var obs = this.jobService.deleteJob(jobId);

        obs.subscribe( response => {
            this.getDataForDay(this._lastViewDate);
        }, error => {
        })
        
        return obs;
    }

    public getJobStartAndEndDate(jobId: string){
        return this.jobService.getJobStartAndEndDate(jobId);
    }

    public getJobDays(jobId: string){
        return this.jobService.getJobDays(jobId);
    }

    public getDataForMonth(date: Date, idWorker: string = null) {
        this._lastViewDate = date;

        this.isMonthLoading.next(true);
        this.hasMonthError.next(false);

        this.calendarService.getMonthData(date, idWorker).subscribe(result => {
            this._monthData.next(List(result))
            this.isMonthLoading.next(false);          
        }, error => {
            this.isMonthLoading.next(false);            
            this.monthErrorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasMonthError.next(true);
        });
    }

    public getDataForWeek(date: Date, idWorker: string = null) {
        this._lastViewDate = date;

        this.isWeekLoading.next(true);
        this.hasWeekError.next(false);

        this.calendarService.getWeekData(date, idWorker).subscribe(result => {
            this._weekData.next(List(result));
            this.isWeekLoading.next(false);
        }, error => {
            this.isWeekLoading.next(false);            
            this.weekErrorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasWeekError.next(true);
        });
    }

    public getDataForDay(date: Date, idWorker: String = null) {
        this._lastViewDate = date;

        this.isDayLoading.next(true);
        this.hasWeekError.next(false);

        this.calendarService.getDayData(date).subscribe(result => {
            this._dayData.next(result[0]);
            this.isDayLoading.next(false);
        }, error => {
            this.isDayLoading.next(false);            
            this.dayErrorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasDayError.next(true);
        });
    }

    public moveWorkerToJob(viewDate: Date, worker: Worker, date: Date, toJob: CalendarJob, workerAddOption: AddWorkerOption){
        var obs = this.jobService.moveWorkerToJob(new MoveWorkerRequestModel(worker.id, toJob.id, date, viewDate, workerAddOption));

        if( workerAddOption != AddWorkerOption.SingleDay ) {
            obs.subscribe( response => {
                this.getDataForWeek(this._lastViewDate);
            }, error => {
            })
        }

        return obs;
    }

    public moveWorkerToAvailable(worker: Worker, date: Date  ){
        return this.jobService.moveWorkerToAvailable(new MoveWorkerRequestModel(worker.id, null, date, null));
    }

    public moveWorkerToOff(worker: Worker, date: Date  ){
        return this.jobService.moveWorkerToOff(new MoveWorkerRequestModel(worker.id, null, date, null));
    }

    public copyCalendarDay(viewDate: Date, dateFrom: Date, dateTo: Date){
        this.isWeekLoading.next(true);

        this.calendarService.copyCalendarDay(viewDate, dateFrom, dateTo).subscribe( result => {
            this._weekData.next(List(result));
            this.isWeekLoading.next(false);
        }, error => {
            this.isWeekLoading.next(false);
            this.weekErrorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;
            this.hasWeekError.next(true);
        })
    }
}