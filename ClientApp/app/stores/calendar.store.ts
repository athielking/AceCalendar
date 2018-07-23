import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';
import * as dateFns from 'date-fns';

import * as calendarTools from '../components/calendar/common/calendar-tools'
import * as dateTools from '../tools/dateTools';
import { Guid } from '../tools/guid';
import { AddWorkerOption } from '../models/shared/calendar-options';
import { environment } from '../../environments/environment';
import { CalendarService } from '../services/calendar.service';
import { CalendarDay, CalendarJob, DayView, Worker, MoveWorkerRequestModel, AddJobModel, SaveTagsRequestModel } from '../components/calendar/common/models';
import { Tag } from '../models/tag/tag.model';
import { isSameDay, subDays } from 'date-fns';
import { JobService } from '../services/job.service';
import { StorageService } from '../services/storage.service';
import { StorageKeys } from '../components/calendar/common/calendar-tools';
import { TagFilter } from '../models/shared/filter.model';
import { SignalrService } from '../services/signalr.service';
import { CalendarModel, CalendarUser, EditCalendarModel } from '../models/calendar/calendar.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class CalendarStore {
    
    private _lastViewDate: Date;
    private _viewDate: BehaviorSubject<Date>;
    private _dayViews: BehaviorSubject<DayView[]> = new BehaviorSubject([]);
    private _phoneDays: BehaviorSubject<DayView[]> = new BehaviorSubject([]);
    private _dayData: BehaviorSubject<DayView> = new BehaviorSubject(undefined);

    private _calendars: BehaviorSubject<CalendarModel[]> = new BehaviorSubject([]);
    private _calendar: BehaviorSubject<CalendarModel> = new BehaviorSubject<CalendarModel>(undefined);
    private _calendarUsers: BehaviorSubject<CalendarUser[]> = new BehaviorSubject([]);
    
    public hasError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public errorMessage: BehaviorSubject<string> = new BehaviorSubject('');

    private _isCacheLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isMonthLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isWeekLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isDayLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);    
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly monthData: Observable<DayView[]>;
    public readonly weekData: Observable<DayView[]>;
    public readonly phoneWeekData: Observable<DayView[]> = this._phoneDays.asObservable();
    public readonly dayData: Observable<DayView> = this._dayData.asObservable();

    public readonly calendars: Observable<CalendarModel[]> = this._calendars.asObservable();
    public readonly calendar: Observable<CalendarModel> = this._calendar.asObservable();
    public readonly calendarUsers: Observable<CalendarUser[]> = this._calendarUsers.asObservable();

    private jobFilter: TagFilter = new TagFilter();
    private workerFilter: TagFilter = new TagFilter();
    
    constructor(
        private calendarService: CalendarService,
        private jobService: JobService,
        private storageService: StorageService,
        private signalRService: SignalrService,
    ) {

        if(this.storageService.hasItem(StorageKeys.jobFilter))
            this.jobFilter.fromJSON(this.storageService.getItem(StorageKeys.jobFilter));

        if(this.storageService.hasItem(StorageKeys.workerFilter))
            this.workerFilter.fromJSON(this.storageService.getItem(StorageKeys.workerFilter));

        this.storageService.watchStorage().subscribe(key => this.handleStorageChange(key));

        this._lastViewDate = 
            storageService.hasItem(StorageKeys.viewDate) ?
            new Date(storageService.getItem(StorageKeys.viewDate)) :
            new Date();

        this._viewDate = new BehaviorSubject( this._lastViewDate );
        
        this.weekData = this._dayViews.combineLatest( this._viewDate, (dayViews, viewDate) => {
            let data = dayViews.filter( dayView => dateFns.isSameWeek( dayView.calendarDay.date, viewDate ));
            data.forEach( dv => dv.refreshCalendarDay(viewDate));

            return data;
        });

        // this.dayData = this._dayViews.combineLatest( this._viewDate, (dayViews, viewDate) => {
        //     return dayViews.find( dayView => dateTools.equal(dayView.calendarDay.date, viewDate));
        // });

        this.monthData = this._dayViews.combineLatest( this._viewDate, (dayViews, viewDate) => {

            let start = dateFns.startOfWeek( dateFns.startOfMonth( this._lastViewDate ));
            let end = dateFns.endOfWeek(dateFns.endOfMonth(this._lastViewDate));

            let data = dayViews.filter( dayView => dateTools.greaterThanEqual(dayView.calendarDay.date, start) && 
                dateTools.lessThanEqual(dayView.calendarDay.date, end));

            data.forEach( dv => dv.refreshCalendarDay(viewDate));

            return data;
        });

        this.signalRService.dataUpdated.subscribe( value => this.handleServerDataUpdated(value));

        var start = dateFns.startOfWeek( dateFns.startOfMonth( this._lastViewDate ));
        var weekBeforeStart = dateFns.subWeeks( dateFns.startOfWeek(this._lastViewDate), 1);
        start = dateTools.lessThan( weekBeforeStart, start ) ? weekBeforeStart : start;
        
        var end = dateFns.endOfWeek(dateFns.endOfMonth(this._lastViewDate));
        var weekAfterEnd = dateFns.endOfWeek(dateFns.addWeeks(dateFns.startOfWeek(this._lastViewDate), 1));
        end = dateTools.greaterThan(weekAfterEnd, end) ? weekAfterEnd : end;

        if(this.storageService.hasItem(StorageKeys.selectedCalendar))
            this.getDataForRange( start, end );
    }

    public addJob(addJobModel: AddJobModel){
        var obs = this.jobService.addJob(addJobModel);
        let dayViews = this._dayViews.getValue();

        addJobModel.jobDays.forEach( date => {
            let dayView = dayViews.find( dv => dateTools.equal(dv.calendarDay.date, date));
            let job = new CalendarJob( addJobModel.id, addJobModel.number, addJobModel.name, addJobModel.notes );
            job.tags = addJobModel.tags.map( t => new Tag( t.id, t.icon, t.description, t.color, t.tagType, t.fromJobDay));

            if(dayView)
                dayView.jobs.push( job );
        });

        this._dayViews.next(dayViews);

        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());
        return obs;
    }

    public editJob(jobId: string, addJobModel: AddJobModel){
        var obs = this.jobService.editJob(jobId, addJobModel);

        let dayViews = this._dayViews.getValue();
        dayViews.forEach( dv => {
            let index = dv.jobs.findIndex( j => j.id == jobId);
            let dayIndex = addJobModel.jobDays.findIndex( d => dateTools.equal( d, dv.calendarDay.date));

            if( index === -1 && dayIndex === -1 )
                return;

            //Job was added    
            if( index === -1 && dayIndex != -1 ){
                let job = new CalendarJob( jobId, addJobModel.number, addJobModel.name, addJobModel.notes );
                job.tags = addJobModel.tags.map( t => new Tag( t.id, t.icon, t.description, t.color, t.tagType, t.fromJobDay));

                dv.jobs.push(job);
            }
            //Job was removed
            else if(index != -1 && dayIndex === -1 ){
                //Add workers to available
                var job = dv.jobs.find( j => j.id == jobId);
                
                var workerIds = job.workers.map(worker => worker.id);

                workerIds.forEach( workerId => {
                    dv.makeWorkerAvailable(workerId);
                });

                //Remove Job    
                dv.jobs.splice( index, 1);                
            }
            //Job was edited
            else {
                var job = dv.jobs.find( j => j.id == jobId);
                job.number = addJobModel.number;
                job.name = addJobModel.name;
                job.notes = addJobModel.notes;
                job.tags = addJobModel.tags.map( t => new Tag( t.id, t.icon, t.description, t.color, t.tagType, t.fromJobDay));
            }
        });

        this._dayViews.next( dayViews );
        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());
        return obs;
    }

    public deleteJob(jobId: string, date: Date){
        let obs = this.jobService.deleteDayJob(jobId, date);
        let dayViews = this._dayViews.getValue();

        var dv = dayViews.find( dv => dateTools.equal(dv.calendarDay.date, date));
        var index = dv.jobs.findIndex( j=> j.id == jobId);

        if(index > -1)
            dv.jobs.splice(index, 1);
        
        this._dayViews.next( dayViews );

        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());
        return obs;
    }

    public deleteJobsFromDay(date: Date){
        let obs = this.jobService.deleteJobsFromDay(date);
        let dayViews = this._dayViews.getValue();

        let dv = dayViews.find(value => dateTools.equal( value.calendarDay.date, date));
        dv.jobs.forEach( job => {
            job.workers.forEach( w => dv.availableWorkers.push(w));
        });
        dv.jobs = [];

        this._dayViews.next(dayViews);

        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());
        return obs;
    }

    public getJobStartAndEndDate(jobId: string){
        return this.jobService.getJobStartAndEndDate(jobId);
    }

    public getJobDays(jobId: string){
        return this.jobService.getJobDays(jobId);
    }

    public getDataForMonth(date: Date, idWorker: string = null) {

        if(this.isMonthLoading.getValue())
            return;

        if( dateTools.equal( this._lastViewDate, date))
            return;

        var dayViews = this._dayViews.getValue();
        let firstCached = dayViews[0].calendarDay.date;
        let lastCached = dayViews[dayViews.length-1].calendarDay.date;
        
        this._lastViewDate = date;
        this._viewDate.next( this._lastViewDate );

        if( dateTools.greaterThanEqual( dateFns.startOfMonth(date), firstCached) &&
            dateTools.lessThanEqual( dateFns.endOfMonth(date), lastCached))    
            return;
        
        var start = dateFns.startOfWeek( dateFns.startOfMonth( this._lastViewDate ));
        var end = dateFns.endOfWeek(dateFns.endOfMonth(this._lastViewDate));
        this.getDataForRange( start, end );
    }

    public getDataForWeek(date: Date, idWorker: string = null) {

        if( this.isWeekLoading.getValue() )
            return;

        if( this._isCacheLoading.getValue())
        {
            this.isWeekLoading.next(true);

            var sub = this._isCacheLoading.subscribe( result => {
                this.isWeekLoading.next(result);
                if(!result)
                    sub.unsubscribe();
            });
        }

        this._viewDate.next(date);

        this.getDataForCache( this._lastViewDate, date);
        this._lastViewDate = date;
    }

    public getPhoneDataForWeek(idWorker: string = null){
        let start = new Date();
        let end = dateFns.addDays( start, 7);
        this.isWeekLoading.next(true);

        this.calendarService.getRangeData(start, end, start, idWorker)
            .subscribe( result => this._phoneDays.next(result), 
                error => this.handleError(error), 
                () => this.isWeekLoading.next(false));
    }

    public getDataForDay(date: Date, idWorker: String = null) {

        var dayViews = this._dayViews.getValue();
        var dv = dayViews.find( dv => dateTools.equal(dv.calendarDay.date, date));
        this._dayData.next(dv);
    }

    public getDataForRange(start: Date, end: Date, idWorker = null ){

        this.isWeekLoading.next(true);
        this.isMonthLoading.next(true);
        this.isDayLoading.next(true);

        this.calendarService.getRangeData(start, end, this._lastViewDate, idWorker).subscribe( result => {
            
            result.forEach( dv => {
                dv.applyJobFilter(this.jobFilter);
                dv.applyWorkerFilter(this.workerFilter);
            });

            this._dayViews.next( result );
            
            this.isWeekLoading.next(false);
            this.isMonthLoading.next(false);
            this.isDayLoading.next(false);
        }, error => this.handleError(error) );
    }

    public clearCache(){
        this.hasError.next(false);
        this.errorMessage.next('');
        this._dayViews.next([]);
    }

    private getCacheStart(lastViewDate: Date, newViewDate: Date): Date {
        let weekBeforeStart = dateFns.subWeeks( dateFns.startOfWeek(newViewDate), 1);
        let viewMonthStart = dateFns.startOfWeek( dateFns.startOfMonth( newViewDate ) );

        return dateTools.lessThan( weekBeforeStart, viewMonthStart) ? weekBeforeStart : viewMonthStart;
    }

    private getCacheEnd(lastViewDate: Date, newViewDate: Date): Date {
        let weekAfterEnd = dateFns.endOfWeek( dateFns.addWeeks(dateFns.startOfWeek(newViewDate), 1) );
        let viewMonthEnd = dateFns.endOfWeek( dateFns.endOfMonth( newViewDate ) );

        return dateTools.greaterThan( weekAfterEnd, viewMonthEnd ) ? weekAfterEnd : viewMonthEnd;
    }

    private getDataForCache( lastViewDate: Date, newViewDate: Date ){
        var dayViews = this._dayViews.getValue();
        let firstCached = dayViews[0].calendarDay.date;
        let lastCached = dayViews[dayViews.length-1].calendarDay.date;
        
        let cacheStart = this.getCacheStart(lastViewDate, newViewDate);
        let cacheEnd = this.getCacheEnd(lastViewDate, newViewDate);
        
        let loadStart: Date;
        let loadEnd: Date;

        //Means our entire range is already cached, dont need to load anything
        if( dateTools.greaterThanEqual(cacheStart, firstCached) && dateTools.lessThanEqual(cacheEnd, lastCached))
        {
            this._viewDate.next(newViewDate);
            this._lastViewDate = newViewDate;
            return;
        }

        if( dayViews.findIndex( dv => dateTools.equal(dv.calendarDay.date, cacheStart )) > -1 ){
            loadStart = dateFns.startOfWeek( dateFns.addWeeks(lastCached ,1 ));
            loadEnd = dateFns.endOfWeek( cacheEnd );
        }
        else if( dayViews.findIndex( dv => dateTools.equal( dv.calendarDay.date, cacheEnd)) > -1){
            loadStart = dateFns.startOfWeek( cacheStart );
            loadEnd = dateFns.endOfWeek(dateFns.addWeeks(firstCached,1));
        }

        this._isCacheLoading.next(true);
        this.calendarService.getRangeData( loadStart, loadEnd, lastViewDate ).subscribe( result => {

            let newCache: DayView[] = [];
            dayViews.concat(result).sort( (a, b) => { 
                if( dateTools.lessThan(a.calendarDay.date, b.calendarDay.date) )
                    return -1;
                else if( dateTools.greaterThan( a.calendarDay.date, b.calendarDay.date))
                    return 1;
                
                return 0;
            }).forEach( dv => {
                
                if( newCache.findIndex( nc => dateTools.equal(nc.calendarDay.date, dv.calendarDay.date)) > -1 )
                    return;

                if( dateTools.inRange( dv.calendarDay.date, cacheStart, cacheEnd ))
                    newCache.push(dv);
            })

            this._dayViews.next(newCache);
            this._isCacheLoading.next(false);
        }, error => this.handleError(error));
    }

    public moveWorkerToJob(viewDate: Date, worker: Worker, date: Date, toJob: CalendarJob, workerAddOption: AddWorkerOption){
        var obs = this.jobService.moveWorkerToJob(new MoveWorkerRequestModel(worker.id, toJob.id, date.toDateString(), viewDate, workerAddOption));

        let start = dateFns.startOfWeek(viewDate);
        let end = dateFns.endOfWeek(viewDate);
        
        let dayViews = this._dayViews.getValue();
        let filtered = dayViews.filter( dv => dateTools.inRange(dv.calendarDay.date, start, end) );

        if( workerAddOption == AddWorkerOption.SingleDay)
            filtered = filtered.filter( dv => dateTools.equal(date, dv.calendarDay.date ));
        else if( workerAddOption == AddWorkerOption.AvailableDays )
            filtered = filtered.filter( dv => dv.workerIsAvailable(worker.id) );
        
        filtered.forEach( dv => dv.addWorkerToJob(worker.id, toJob));
        this._dayViews.next( dayViews );

        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());
        return obs;
    }

    public moveWorkerToAvailable(worker: Worker, date: Date  ){
        var obs = this.jobService.moveWorkerToAvailable(new MoveWorkerRequestModel(worker.id, null, date.toISOString(), null));

        this.makeWorkerAvailable(worker.id, date);

        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());
        return obs;
    }

    public moveWorkerToOff(worker: Worker, date: Date  ){
        var obs = this.jobService.moveWorkerToOff(new MoveWorkerRequestModel(worker.id, null, date.toISOString(), null));
        
        this.addTimeOff(worker.id, date);
        
        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());
        return obs;
    }

    public copyCalendarDay(viewDate: Date, dateFrom: Date, dateTo: Date){
        var obs = this.calendarService.copyCalendarDay(viewDate, dateFrom, dateTo);
        this.isWeekLoading.next(true);

        var dayViews = this._dayViews.getValue();
        var copyFrom = dayViews.find( dv => dateTools.equal( dv.calendarDay.date, dateFrom));

        let jobs: CalendarJob[] = [];
        let availableWorkers: Worker[] = [];
        let timeOffWorkers: Worker[] = [];
        let tagsByJob: Map<string, Tag[]> = new Map<string, Tag[]>();
        let workersByJob: Map<string, Worker[]> = new Map<string,Worker[]>();

        copyFrom.jobs.forEach( j => jobs.push( new CalendarJob(j.id, j.number, j.name, j.notes)));
        copyFrom.availableWorkers.forEach( w => availableWorkers.push( new Worker(w.id, w.firstName, w.lastName, w.email, w.phone, w.tags)));
        copyFrom.timeOffWorkers.forEach( w => timeOffWorkers.push(new Worker(w.id, w.firstName, w.lastName, w.email, w.phone, w.tags)));
        copyFrom.tagsByJob.forEach((value, key) =>{
            let tags: Tag[] = [];
            value.forEach( t => tags.push(new Tag(t.id, t.icon, t.description, t.color, t.tagType, t.fromJobDay)));
            tagsByJob.set(key, tags);
        });

        copyFrom.workersByJob.forEach( (value, key) => {
            let workers: Worker[] =[];
            value.forEach( w => workers.push( new Worker( w.id, w.firstName, w.lastName, w.email, w.phone, w.tags)));
            workersByJob.set(key, workers);
        })

        jobs.forEach( j => {
            if( workersByJob.has(j.id ))
                j.workers = workersByJob.get(j.id);
            if(tagsByJob.has(j.id))
                j.tags = tagsByJob.get(j.id);
        });

        var copyTo = new DayView( new CalendarDay(dateTo, viewDate), jobs, availableWorkers, timeOffWorkers);
        copyTo.tagsByJob = tagsByJob;
        copyTo.workersByJob = workersByJob;

        var toIndex = dayViews.findIndex( dv => dateTools.equal( dv.calendarDay.date, dateTo));
        dayViews[toIndex] = copyTo;
        
        this._dayViews.next( dayViews );

        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());

        this.isWeekLoading.next(false);
        return obs;
    }

    public saveTagsForJobDay(jobId: string, tags: Tag[], date: Date){
        let obs = this.jobService.saveTags(jobId, new SaveTagsRequestModel(jobId, tags, date) );

        let dayViews = this._dayViews.getValue();
        let dv = dayViews.find( d => dateTools.equal( d.calendarDay.date, date ));

        let job = dv.jobs.find( j => j.id === jobId );
        let jobTags = job.tags.filter( t => !t.fromJobDay);

        tags.forEach( t => {
            if( jobTags.findIndex( jt => jt.id == t.id ) == -1 )
                jobTags.push( new Tag(t.id, t.icon, t.description, t.color, t.tagType, true) );
        });

        job.tags = jobTags;

        this._dayViews.next(dayViews);

        var sub = obs.subscribe( result => {}, error => this.handleError(error), () => sub.unsubscribe());
        return obs;
    }

    public makeWorkerAvailable( workerId: string, date: Date ){
        var dayViews = this._dayViews.getValue();
        var dayView = dayViews.find( dv => dateTools.equal( dv.calendarDay.date, date));

        if(dayView) {
            dayView.makeWorkerAvailable(workerId);
        }

        this._dayViews.next( dayViews );    
    }

    public addTimeOff( workerId: string, date: Date ){
        var dayViews = this._dayViews.getValue();
        var dayView = dayViews.find( dv => dateTools.equal( dv.calendarDay.date, date));

        if(dayView) {
            dayView.makeWorkerOff(workerId);
        }

        this._dayViews.next( dayViews );
    }

    public getCalendarsForOrganization(){
        this.isLoading.next(true);
        this.hasError.next(false);

        var sub = this.calendarService.getCalendarsForOrganization()
            .subscribe(result => {
                this._calendars.next(result);
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.handleError(error);
            }, () => {sub.unsubscribe();})
    }

    public addCalendarRecord( organizationId: string, calendarName: string){

        var model = new CalendarModel('', calendarName, organizationId, false);
        var obs = this.calendarService.addCalendar(model);

        var sub = obs.subscribe( result => {
            model = new CalendarModel(result['data'].id, result['data'].calendarName, result['data'].organizationId, result['data'].inactive);
            let records = this._calendars.getValue();
            records.push( model );

            this._calendars.next( records );
        }, error => this.handleError(error), () => sub.unsubscribe())

        return obs;
    }

    public inactivateCalendarRecord(organizationId: string, calendarId: string) {
        var obs = this.calendarService.inactivateCalendarRecord(organizationId, calendarId);
        
        obs.subscribe( response => { 
            let calendars = this._calendars.getValue();
            
            calendars.forEach( calendar => {
                if(calendar.id === calendarId)
                    calendar.inactive = true;
            });

            this._calendars.next( calendars );
        }, error => {
        });

        return obs;
    }

    public activateCalendarRecord(organizationId: string, calendarId: string,) {
        var obs = this.calendarService.activateCalendarRecord(organizationId, calendarId);
        
        obs.subscribe( response => { 
            let calendars = this._calendars.getValue();
            
            calendars.forEach( calendar => {
                if(calendar.id === calendarId)
                    calendar.inactive = false;
            });

            this._calendars.next( calendars );
        }, error => {
        });

        return obs;
    }

    public editCalendarRecord(calendarId: string, calendarName: string) {
        var editCalendarModel = new EditCalendarModel(calendarName);

        var obs = this.calendarService.editCalendar(calendarId, editCalendarModel);

        var sub = obs.subscribe( result => {
            var calendar = this._calendar.getValue();

            calendar.calendarName = editCalendarModel.calendarName;
            
            this._calendar.next( calendar );
        }, error => this.handleError(error), () => sub.unsubscribe())

        return obs;
    }

    public deleteCalendarRecord(id: string){
        var obs = this.calendarService.deleteCalendar(id);

        var sub = obs.subscribe(result => {
            this._calendars.next(result);
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);
            this.handleError(error);
        }, () => {sub.unsubscribe();})

        return obs;
    }

    public getCalendarRecord( id: string ){
        this.isLoading.next(true);
        this.hasError.next(false);

        var sub = this.calendarService.getCalendar(id)
            .subscribe( result => {
                this._calendar.next(result);
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.handleError(error);
            }, () => {sub.unsubscribe();})
    }

    public getCalendarUsers(id: string){
        this.isLoading.next(true);
        this.hasError.next(false);

        var sub = this.calendarService.getCalendarUsers(id)
            .subscribe( result => {
                this._calendarUsers.next(result);
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.handleError(error);
            }, () => {sub.unsubscribe()})
    }

    public assignUsersToCalendar(id: string, users: string[])
    {
        this.isLoading.next(true);
        this.hasError.next(false);

        var obs = this.calendarService.assignUsersToCalendar(id, users);
        var sub = obs.subscribe( result => {
                this._calendarUsers.next(result);
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.handleError(error);
            }, () => {sub.unsubscribe()})
        
        return obs;
    }

    public deleteUserFromCalendar(id: string, userId: string)
    {
        var sub = this.calendarService.deleteUserFromCalendar(id, userId)
            .subscribe( result => {
                this._calendarUsers.next(result);
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.handleError(error);
            }, () => {sub.unsubscribe()});
    }

    private handleError(error: any){
        console.log(error);

        this.hasError.next(true)
        if( error.message )
        this.errorMessage.next( error.message );
        else if( error.error && error.error.errorMessage )
            this.errorMessage.next( error.error.errorMessage );
    }

    private handleStorageChange(key: string){
        
        let dayViews = this._dayViews.getValue();

        if(key == StorageKeys.jobFilter)
        { 
            this.jobFilter.fromJSON(this.storageService.getItem(StorageKeys.jobFilter));
            dayViews.forEach( dv => dv.applyJobFilter(this.jobFilter));
        }

        if(key == StorageKeys.workerFilter )
        {
            this.workerFilter.fromJSON(this.storageService.getItem(StorageKeys.workerFilter));
            dayViews.forEach( dv => dv.applyWorkerFilter(this.workerFilter));
        }

        this._dayViews.next(dayViews);

        if(key == StorageKeys.selectedCalendar)
        {
            if(!this.storageService.hasItem(key))
                return;
                
            var start = dateFns.startOfWeek( dateFns.startOfMonth( this._lastViewDate ));
            var weekBeforeStart = dateFns.subWeeks( dateFns.startOfWeek(this._lastViewDate), 1);
            start = dateTools.lessThan( weekBeforeStart, start ) ? weekBeforeStart : start;
            
            var end = dateFns.endOfWeek(dateFns.endOfMonth(this._lastViewDate));
            var weekAfterEnd = dateFns.endOfWeek(dateFns.addWeeks(dateFns.startOfWeek(this._lastViewDate), 1));
            end = dateTools.greaterThan(weekAfterEnd, end) ? weekAfterEnd : end;

            this.getDataForRange(start, end);
        }

        if(key == StorageKeys.tokenName)
        {
            if(!this.storageService.hasItem(StorageKeys.tokenName))
                this.clearCache();
        }
    }

    private handleServerDataUpdated(dayViews: DayView[]){

        if(!dayViews)
            return;
            
        var cached = this._dayViews.getValue();

        dayViews.forEach( dv => {
            let cIndex = cached.findIndex( c => dateTools.equal(c.calendarDay.date, dv.calendarDay.date));
            if(cIndex == -1)
                return;

            dv.applyJobFilter(this.jobFilter);
            dv.applyWorkerFilter(this.workerFilter);

            cached[cIndex] = dv;
        });

        this._dayViews.next(cached);
    }
}