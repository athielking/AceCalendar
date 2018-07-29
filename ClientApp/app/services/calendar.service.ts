import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as dateFns from 'date-fns';

import { environment } from '../../environments/environment';
import { Worker, CalendarJob, DayView, CalendarDay } from '../components/calendar/common/models';
import { Tag } from '../models/tag/tag.model';
import { CalendarModel, CalendarUser, EditCalendarModel } from '../models/calendar/calendar.model';

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

    public getCalendarsForOrganization(){
        return this.httpClient.get(this.api).map( response => {
            return this.mapCalendarResponse(response['records']);
        });
    }

    public mapCalendarResponse( data: any ) : CalendarModel[]{
        return data.map( item => {
            return new CalendarModel(item.id, item.calendarName, item.organizationId, item.inactive);
        });
    }

    public getCalendar( id: string ){
        let httpStr = this.api + id;
        return this.httpClient.get(httpStr).map( response => {
            return new CalendarModel( response['data'].id, response['data'].calendarName, response['data'].organizationId, response['data'].inactive );
        })
    }

    public getCalendarUsers(id: string){
        let httpStr = this.api + `users/${id}`;

        return this.httpClient.get(httpStr).map( response => {
            return response['records'].map( item => {
                return new CalendarUser( item.id, item.calendarId, item.userId);
            })
        });
    }

    public assignUsersToCalendar(id: string, users: string[]){
        let httpStr = this.api + `users/${id}`;

        return this.httpClient.post(httpStr, users).shareReplay().map( response => {
            return response['records'].map( item => {
                return new CalendarUser( item.id, item.calendarId, item.userId);
            })
        });
    }

    public deleteUserFromCalendar(id: string, userId: string){
        let httpStr = this.api + `user/${id}/${userId}`;

        return this.httpClient.delete(httpStr).shareReplay().map( response => {
            return response['records'].map( item => {
                return new CalendarUser( item.id, item.calendarId, item.userId);
            })
        });
    }

    public addCalendar( calendar: CalendarModel ){
        return this.httpClient.post(this.api, calendar).shareReplay();
    }

    public inactivateCalendarRecord(organizationId: string, calendarId: string){
        return this.httpClient.get(this.api + `/inactivateCalendarRecord/${organizationId}/${calendarId}`);
    }

    public activateCalendarRecord(organizationId: string, calendarId: string){
        return this.httpClient.get(this.api + `/activateCalendarRecord/${organizationId}/${calendarId}`);
    }

    public editCalendar( calendarId: string, editCalendarModel: EditCalendarModel){
        return this.httpClient.put(this.api + `/${calendarId}`, editCalendarModel).shareReplay();
    }

    public deleteCalendar( id: string){
        let httpStr = this.api + id;
        return this.httpClient.delete(httpStr).shareReplay().map( response => {
            return this.mapCalendarResponse(response['records']);
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
            .map(response => this.mapDayViewResponse(viewDate, response));
    }

    public mapDayViewResponse(viewDate: Date, response: any){
        let daymap : Map<Date, DayView> = new Map<Date, DayView>();
                let dayViews : DayView[] = [];

                var obj = response["data"];
                let keys = Object.keys(obj);

                keys.forEach(key => {

                    var ymd = key.substr(0, key.indexOf("T")).split("-");
                    let d: Date = new Date(+ymd[0], (+ymd[1])-1, +ymd[2]);
                
                    let workersByJob: Map<string, Worker[]> = new Map<string, Worker[]>();
                    let tagsByJob: Map<string, Tag[]> = new Map<string, Tag[]>();
                    let tagsByWorker: Map<string, Tag[]>= new Map<string, Tag[]>();

                    let guids = Object.keys(obj[key].tagsByWorker);
                    guids.forEach( g=> {
                        if(!obj[key].tagsByWorker[g])
                            return;
                        
                            tagsByWorker.set( g, obj[key].tagsByWorker[g].map( item => {
                            return new Tag(item.id, item.icon, item.description, item.color, item.tagType, false );
                        }));
                    });

                    guids = Object.keys(obj[key].workersByJob)
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
                                tagsByWorker.has(item.id) ? tagsByWorker.get(item.id) : [] );
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
                            tagsByWorker.has(item.id) ? tagsByWorker.get(item.id) : [] 
                        );
                    });

                    let offWorkers : Worker[] = obj[key].timeOffWorkers.map( item => {
                        return new Worker(
                            item.id,
                            item.firstName,
                            item.lastName,
                            item.email,
                            item.phone,
                            tagsByWorker.has(item.id) ? tagsByWorker.get(item.id) : [] 
                        );
                    });

                    let dv = new DayView( new CalendarDay(d, viewDate ), jobs, workers, offWorkers );
                    dv.workersByJob = workersByJob;
                    dv.tagsByJob = tagsByJob;

                    dayViews.push(dv);
                    daymap.set(d, dv);
                });

                return dayViews;
    }
}