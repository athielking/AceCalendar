import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import * as startOfWeek from 'date-fns/start_of_week';
import * as endOfWeek from 'date-fns/end_of_week';
import * as isSameWeek from 'date-fns/is_same_week';

import { environment } from '../../environments/environment';
import { CalendarService } from '../services/calendar.service';
import { CalendarDay, CalendarJob, DayView, Worker } from '../components/calendar/common/models';
import { isSameDay, subDays } from 'date-fns';
import { JobService } from '../services/job.service';

@Injectable()
export class CalendarStore {
    private _dayViews: Map<Date, BehaviorSubject<DayView>> = new Map<Date, BehaviorSubject<DayView>>();

    private _monthData: BehaviorSubject<DayView[]> = new BehaviorSubject([]);
    private _weekData: BehaviorSubject<DayView[]> = new BehaviorSubject([]);

    private _dayData: BehaviorSubject<Observable<DayView>> = new BehaviorSubject(new Observable<DayView>());

    public readonly monthData: Observable<DayView[]> = this._monthData.asObservable();
    public readonly weekData: Observable<DayView[]> = this._weekData.asObservable();

    public readonly dayData: Observable<Observable<DayView>> = this._dayData.asObservable();

    constructor(private calendarService: CalendarService,
                private jobService: JobService) {
        this._initialize();
    }

    public getDataForMonth(date: Date) {
        this.calendarService.getMonthData(date).subscribe(result => {
            this._monthData.next(this._serviceCallback(result))
        });
    }

    public getDataForWeek(date: Date) {
        this.calendarService.getWeekData(date).subscribe(result => {
            this._weekData.next(this._serviceCallback(result));
        });
    }

    public getDataForDay(date: Date) {

    }

    public moveWorkerToJob(worker: Worker, date: Date, toJob: CalendarJob ){
        return this.jobService.moveWorkerToJob( worker.id, toJob ? toJob.id : null, date);
    }

    public moveWorkerToAvailable(worker: Worker, date: Date  ){
        return this.jobService.moveWorkerToAvailable( worker.id, date);
    }

    public moveWorkerToOff(worker: Worker, date: Date  ){
        return this.jobService.moveWorkerToOff( worker.id, date);
    }

    private _initialize() {
        let today: Date = new Date();
        this.monthData.subscribe(result => {

            let keys = Array.from(result.keys());

            var tempWeek: DayView[] = [];

            result.forEach( dv => {
                if(isSameWeek(today, dv.calendarDay.date))
                    tempWeek.push(dv);
            })
        
            this._weekData.next(tempWeek);
        });

        this.getDataForMonth(today);
    }

    private _serviceCallback(value: DayView[]): DayView[] {

        value.forEach(dv => {
            if (this._dayViews.has(dv.calendarDay.date))
                this._dayViews.get(dv.calendarDay.date).next(dv);
            else {
                var subj = new BehaviorSubject<DayView>(dv);
                this._dayViews.set(dv.calendarDay.date, subj);
            }
        });

        return value;
    }
}