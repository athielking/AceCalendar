import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { CalendarService } from '../services/calendar.service';
import { CalendarDay, CalendarJob, DayView } from '../components/calendar/common/models';

@Injectable()
export class CalendarStore{
    private _dayViews : Map<Date,BehaviorSubject<DayView>> = new Map<Date, BehaviorSubject<DayView>>();
    private _calendarData : BehaviorSubject<Map<Date,Observable<DayView>>> = new BehaviorSubject(new Map<Date,Observable<DayView>>());

    public readonly calendarData : Observable<Map<Date,Observable<DayView>>> = this._calendarData.asObservable();

    constructor(private calendarService: CalendarService){
    }

    getDataForMonth(date: Date)
    {
        this.calendarService.getMonthData(date).subscribe( result => this._serviceCallback(result) );
    }

    getDataForWeek(date: Date)
    {
        this.calendarService.getWeekData(date).subscribe( result => this._serviceCallback(result) );
    }

    getDataForDay(date: Date)
    {
        this.calendarService.getDayData(date).subscribe( result => this._serviceCallback(result) );
    }

    private _serviceCallback(value: Map<Date,DayView>){
        var dataMap = new Map<Date, Observable<DayView>>();

        value.forEach((dayView, key, map) => {
            var subj = new BehaviorSubject(dayView);

            this._dayViews.set(key, subj);
            dataMap.set(key, subj.asObservable());
        });

        this._calendarData.next(dataMap);
        this._dayViews.forEach((dayView, date, map)=> {
            dayView.next(value.get(date));
        });
    }
}