import { Injectable, keyframes } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Worker, CalendarJob, DayView } from '../components/calendar/common/models';
import { getCalendarDay } from '../components/calendar/common/calendar-tools';
//import { Map } from 'immutable';

enum ApiMethod{
    Month = "getMonth",
    Week = "getWeek",
    Day = "getDay"
}

@Injectable()
export class CalendarService{

    api: string = `${environment.webServiceUrl}/api/calendar/`;

    constructor( private httpClient: HttpClient ){
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

        return this.httpClient.get(this.api+ `${type}?date=${date.toISOString()}`)
            .map(response => {
                
                let daymap : Map<Date, DayView> = new Map<Date, DayView>();
                let dayViews : DayView[] = [];

                var obj = response["data"];
                let keys = Object.keys(obj);

                keys.forEach(key => {

                    let d: Date = new Date(key);

                    let workersByJob: Map<string, Worker[]> = new Map<string, Worker[]>();

                    let guids = Object.keys(obj[key].workersByJob);
                    guids.forEach(g => {

                        if(!obj[key].workersByJob[g])
                            return;

                        workersByJob.set(g, obj[key].workersByJob[g].map( item => {
                                return new Worker( 
                                    item.id, 
                                    item.firstName, 
                                    item.lastName, 
                                    item.email, 
                                    item.phone);
                        }));
                    });

                    let jobs : CalendarJob[] = obj[key].jobs.map( item => {
    
                        var cj = new CalendarJob(
                            item.id, 
                            item.number, 
                            item.name, 
                            item.type );
                    
                        if( workersByJob.has(item.id))
                            cj.workers = workersByJob.get(item.id);

                        return cj;
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

                    

                    let dv = new DayView(getCalendarDay( d, date ), jobs,workers );
                    dv.workersByJob = workersByJob;

                    dayViews.push(dv);
                    daymap.set(d, dv);
                });

                return dayViews;
            });

    }

}