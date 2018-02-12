import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';
import * as startOfWeek from 'date-fns/start_of_week';
import * as endOfWeek from 'date-fns/end_of_week';
import * as isSameWeek from 'date-fns/is_same_week';

import { environment } from '../../environments/environment';
import { CalendarService } from '../services/calendar.service';
import { CalendarDay, CalendarJob, DayView, Worker, MoveWorkerRequestModel } from '../components/calendar/common/models';
import { isSameDay, subDays } from 'date-fns';
import { JobService } from '../services/job.service';

@Injectable()
export class CalendarStore {
    
    private _monthData: BehaviorSubject<List<DayView>> = new BehaviorSubject(List([]));
    
    private _weekData: BehaviorSubject<List<DayView>> = new BehaviorSubject(List([]));

    private _dayData: BehaviorSubject<Observable<DayView>> = new BehaviorSubject(new Observable<DayView>());

    public monthErrorMessage: string;

    public hasMonthError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isMonthLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public weekErrorMessage: string;

    public hasWeekError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isWeekLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly monthData: Observable<List<DayView>> = this._monthData.asObservable();

    public readonly weekData: Observable<List<DayView>> = this._weekData.asObservable();

    public readonly dayData: Observable<Observable<DayView>> = this._dayData.asObservable();

    constructor(private calendarService: CalendarService,
                private jobService: JobService) {
    }

    public getDataForMonth(date: Date) {
        this.isMonthLoading.next(true);
        this.hasMonthError.next(false);

        this.calendarService.getMonthData(date).subscribe(result => {
            this._monthData.next(List(result))
            this.isMonthLoading.next(false);          
        }, error => {
            this.isMonthLoading.next(false);            
            this.monthErrorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasMonthError.next(true);
        });
    }

    public getDataForWeek(date: Date) {
        this.isWeekLoading.next(true);
        this.hasWeekError.next(false);

        this.calendarService.getWeekData(date).subscribe(result => {
            this._weekData.next(List(result));
            this.isWeekLoading.next(false);
        }, error => {
            this.isWeekLoading.next(false);            
            this.weekErrorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasWeekError.next(true);
        });
    }

    public getDataForDay(date: Date) {

    }

    public moveWorkerToJob(worker: Worker, date: Date, toJob: CalendarJob ){
        return this.jobService.moveWorkerToJob(new MoveWorkerRequestModel(worker.id, toJob.id, date));
    }

    public moveWorkerToAvailable(worker: Worker, date: Date  ){
        return this.jobService.moveWorkerToAvailable(new MoveWorkerRequestModel(worker.id, null, date));
    }

    public moveWorkerToOff(worker: Worker, date: Date  ){
        return this.jobService.moveWorkerToOff(new MoveWorkerRequestModel(worker.id, null, date));
    }
}