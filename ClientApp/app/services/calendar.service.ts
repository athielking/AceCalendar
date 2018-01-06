import { Injectable, keyframes } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { Worker, CalendarJob, DayView } from '../components/calendar/common/models';
import { getCalendarDay } from '../components/calendar/common/calendar-tools';

enum ApiMethod{
    Month = "getMonth",
    Week = "getWeek",
    Day = "getDay"
}

@Injectable()
export class CalendarService{

    api: string = `${environment.webServiceUrl}/api/calendar/`;

    constructor( private http: Http ){
    }
    
    getMonthData(date:Date){
        return this._getData(date, ApiMethod.Month);
    }

    getWeekData(date: Date){
        return this._getData(date, ApiMethod.Week);
    }

    getDayData(date: Date){
        return this._getData(date, ApiMethod.Day);
    }

    private _getData(date: Date, type: ApiMethod){

        return this.http.get(this.api+ `${type}?date=${date.toISOString()}`)
            .map(response => {
                
                let daymap : Map<Date, DayView> = new Map<Date, DayView>();

                var obj = response.json().data;
                let keys = Object.keys(obj);

                keys.forEach(key => {
                    let d: Date = new Date(key);

                    let jobs : CalendarJob[] = obj[key].jobs.map( item => {
                        return new CalendarJob(
                            item.id, 
                            item.number, 
                            item.name, 
                            item.type );
                        });

                    let workers : Worker[] = obj[key].availableWorkers.map( item => {
                        return new Worker(
                            item.id,
                            item.firstName,
                            item.lastName,
                            item.email,
                            item.phone
                        );
                    });

                    daymap.set(d, new DayView(getCalendarDay( d ), jobs,workers ));
                });

                return daymap;
            });

    }

}