import { Injectable, keyframes } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import * as ParseDate from 'date-fns/parse';

import { environment } from '../../environments/environment';
import { Worker, CalendarJob, DayView } from '../components/calendar/common/models';
import { getCalendarDay } from '../components/calendar/common/calendar-tools';
import {Tag} from '../models/tag/tag.model';

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
        return this._getData(date, ApiMethod.Month).shareReplay();
    }

    getWeekData(date: Date){
        return this._getData(date, ApiMethod.Week).shareReplay();
    }

    getDayData(date: Date){
        return this._getData(date, ApiMethod.Day).shareReplay();
    }

    private _getData(date: Date, type: ApiMethod){

        return this.httpClient.get(this.api+ `${type}?date=${date.toISOString()}`)
            .map(response => {
                
                let daymap : Map<Date, DayView> = new Map<Date, DayView>();
                let dayViews : DayView[] = [];

                var obj = response["data"];
                let keys = Object.keys(obj);

                keys.forEach(key => {

                    var ymd = key.substr(0, key.indexOf("T")).split("-");
                    let d: Date = new Date(+ymd[0], (+ymd[1])-1, +ymd[2]);
                
                    let workersByJob: Map<string, Worker[]> = new Map<string, Worker[]>();
                    let tagsByJob: Map<string, Tag[]> = new Map<string, Tag[]>();

                    let guids = Object.keys(obj[key].workersByJob)
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

                    guids = Object.keys(obj[key].tagsByJob);
                    guids.forEach( g=> {
                        if(!obj[key].tagsByJob[g])
                            return;
                        
                        tagsByJob.set( g, obj[key].tagsByJob[g].map( item => {
                            return new Tag(item.id, item.icon, item.description, item.color, item.fromJobDay == 1 ? true : false);
                        }));
                    });

                    let jobs : CalendarJob[] = obj[key].jobs.map( item => {
    
                        var cj = new CalendarJob(
                            item.id, 
                            item.number, 
                            item.name, 
                            item.notes);
                    
                        if( workersByJob.has(item.id))
                            cj.workers = workersByJob.get(item.id);

                        if( tagsByJob.has(item.id))
                            cj.jobTags = tagsByJob.get(item.id);

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

                    let offWorkers : Worker[] = obj[key].timeOffWorkers.map( item => {
                        return new Worker(
                            item.id,
                            item.firstName,
                            item.lastName,
                            item.email,
                            item.phone
                        );
                    });

                    let dv = new DayView(getCalendarDay( d, date ), jobs, workers, offWorkers );
                    dv.workersByJob = workersByJob;
                    dv.tagsByJob = tagsByJob;

                    dayViews.push(dv);
                    daymap.set(d, dv);
                });

                return dayViews;
            });

    }

}