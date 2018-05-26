import { Injectable, keyframes } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import * as ParseDate from 'date-fns/parse';
import * as dateFns from 'date-fns';

import { environment } from '../../environments/environment';
import { Worker, CalendarJob, DayView } from '../components/calendar/common/models';
import { getCalendarDay } from '../components/calendar/common/calendar-tools';
import {Tag} from '../models/tag/tag.model';

enum ApiMethod{
    Month = "getMonth",
    Week = "getWeek",
    Day = "getDay",
    Range = "getRange"
}

@Injectable()
export class CalendarService{

    api: string = `${environment.webServiceUrl}/api/calendar/`;

    constructor( private httpClient: HttpClient ){
    }
    
    getMonthData(date:Date, idWorker: string = null){
        return this._getData(date, ApiMethod.Month, idWorker ).shareReplay();
    }

    getWeekData(date: Date, idWorker: string = null){
        return this._getData(date, ApiMethod.Week, idWorker ).shareReplay();
    }

    getDayData(date: Date, idWorker: string = null){
        return this._getData(date, ApiMethod.Day, idWorker).shareReplay();
    }

    getRangeData( date: Date, end: Date, viewDate: Date, idWorker: string = null){
        return this._getData(date, ApiMethod.Range, idWorker, end, viewDate);
    }

    public copyCalendarDay(viewDate: Date, dateFrom: Date, dateTo: Date){
        let httpStr = this.api+ `copyCalendarDay?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`;

        return this.httpClient.post(httpStr,{}).shareReplay();
    }

    private _getData2(date: Date, idWorker: string, type: ApiMethod){
        let httpStr = this.api+ `${type}?date=${date.toISOString()}`;
        if(idWorker)
            httpStr = httpStr + `&idWorker=${idWorker}`;

        return this.httpClient.get(httpStr)
            .map(response => {

                let obj = response["data"];
                //let keys = Object.keys(obj);
                let dayViews: DayView[] = [];

                obj.forEach( dv => {
                    let ymd = dv.date.substr(0, dv.date.indexOf("T")).split("-");
                    let d: Date = new Date(+ymd[0], (+ymd[1])-1, +ymd[2]);

                    let jobs: CalendarJob[] = dv.jobs.map( item => {
                        let job = new CalendarJob(item.id, item.number, item.name, item.notes);
                        job.workers = item.workers.map( item => new Worker(item.id, item.firstName, item.lastName, item.email, item.phone, item.tags));
                        job.tags = item.tags.map( item => new Tag(item.id, item.icon, item.description, item.color, item.tagType, item.fromJobDay));

                        return job;
                    });

                    let availableWorkers: Worker[] = dv.availableWorkers.map( item => new Worker(item.id, item.firstName, item.lastName, item.email, item.phone, item.tags));
                    let timeOffWorkers: Worker[] = dv.timeOffWorkers.map( item => new Worker(item.id, item.firstName, item.lastName, item.email, item.phone, item.tags));

                    dayViews.push( new DayView( getCalendarDay(d, date), jobs, availableWorkers, timeOffWorkers));
                });

                return dayViews;
            });
    }

    private _getData(date: Date, type: ApiMethod, idWorker: string = null, end: Date = null, viewDate: Date = null ){

        if(!viewDate)
            viewDate = date;

        let httpStr = this.api+ `${type}?date=${dateFns.startOfDay(date).toISOString()}`;
        
        if(end)
            httpStr += `&endDate=${dateFns.startOfDay(end).toISOString()}`;

        if(idWorker)
            httpStr = httpStr + `&idWorker=${idWorker}`;

        return this.httpClient.get(httpStr)
            .map(response => this._mapDayViewResponse(viewDate, response));
    }

    private _mapDayViewResponse(viewDate: Date, response: any){
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
                                item.phone,
                                item.tags);
                        }));
                    });

                    guids = Object.keys(obj[key].tagsByJob);
                    guids.forEach( g=> {
                        if(!obj[key].tagsByJob[g])
                            return;
                        
                        tagsByJob.set( g, obj[key].tagsByJob[g].map( item => {
                            return new Tag(item.id, item.icon, item.description, item.color, item.tagType, item.fromJobDay == 1 );
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
                            cj.tags = tagsByJob.get(item.id);

                        return cj;
                    });

                    let workers : Worker[] = obj[key].availableWorkers.map( item => {
                        return new Worker(
                            item.id,
                            item.firstName,
                            item.lastName,
                            item.email,
                            item.phone, 
                            item.tags
                        );
                    });

                    let offWorkers : Worker[] = obj[key].timeOffWorkers.map( item => {
                        return new Worker(
                            item.id,
                            item.firstName,
                            item.lastName,
                            item.email,
                            item.phone,
                            item.tags
                        );
                    });

                    let dv = new DayView(getCalendarDay( d, viewDate ), jobs, workers, offWorkers );
                    dv.workersByJob = workersByJob;
                    dv.tagsByJob = tagsByJob;

                    dayViews.push(dv);
                    daymap.set(d, dv);
                });

                return dayViews;
    }

    
}