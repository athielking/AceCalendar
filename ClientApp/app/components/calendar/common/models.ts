import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import {AddWorkerOption}  from '../../../models/shared/calendar-options';
import * as calendarTools from '../../../components/calendar/common/calendar-tools';
import {Tag, ITaggedEntity} from '../../../models/tag/tag.model';
import {Guid} from '../../../tools/guid';
import { TagFilter } from '../../../models/shared/filter.model';

export class MonthView{
    constructor(public header: CalendarDay[],
                public daysOfMonth: CalendarDay[]){
    }
}

export class DayView{

    public workersByJob : Map<string, Worker[]>;
    public tagsByJob: Map<string, Tag[]>;

    constructor(public calendarDay: CalendarDay, 
                public jobs: CalendarJob[],
                public availableWorkers: Worker[],
                public timeOffWorkers: Worker[])
                {
                }

    public refreshCalendarDay(viewDate: Date){
        var cd = calendarTools.getCalendarDay(this.calendarDay.date, viewDate);
        this.calendarDay = cd;
    }

    public applyJobFilter(filter: TagFilter){
        this.jobs.forEach( job => job.isFiltered = filter.enabled && !filter.matchesFilter(job));
    }

    public applyWorkerFilter( filter: TagFilter ){
        this.availableWorkers.forEach( worker => worker.isFiltered = filter.enabled && !filter.matchesFilter(worker));
        this.timeOffWorkers.forEach( worker => worker.isFiltered = filter.enabled && !filter.matchesFilter(worker));

        this.jobs.forEach( job => {
            job.workers.filter( worker => worker.isFiltered = filter.enabled && !filter.matchesFilter(worker));
        })
    }

    public makeWorkerAvailable( workerId: string ){

        if(this.workerIsAvailable(workerId))
            return;

        let removed: Worker;            
        if(this.workerIsOff(workerId))
            removed = this._removeWorker(workerId, this.timeOffWorkers);
        else {
            var job = this.findJobForWorker(workerId);
            removed = this._removeWorker(workerId, job.workers);
        }

        this.availableWorkers.push(removed);
    }

    public makeWorkerOff( workerId: string ){
        if(this.workerIsOff(workerId))
            return;

        let removed: Worker;
        if(this.workerIsAvailable(workerId))
            removed = this._removeWorker(workerId, this.availableWorkers);
        else {
            var job = this.findJobForWorker(workerId);
            removed = this._removeWorker(workerId, job.workers);
        }
        
        this.timeOffWorkers.push(removed);
    }

    public addWorkerToJob( workerId: string, calendarJob: CalendarJob){

        let jobTo = this.jobs.find( j => j.id === calendarJob.id );
        if( !jobTo )
            return;

        let removed: Worker;
        if( this.workerIsAvailable(workerId)){
            removed = this._removeWorker( workerId, this.availableWorkers );
        }
        else if( this.workerIsOff(workerId)){
            removed = this._removeWorker(workerId, this.timeOffWorkers);
        }
        else{
            var jobFrom = this.findJobForWorker(workerId);
            removed = this._removeWorker(workerId, jobFrom.workers);
        }

        jobTo.workers.push(removed);
    }

    public workerIsAvailable(workerId: string): Boolean{
        return this.availableWorkers.findIndex( w => w.id === workerId) > -1;
    }
    
    public workerIsOff(workerId: string): Boolean{
        return this.timeOffWorkers.findIndex(w => w.id === workerId) > -1;
    }

    public findJobForWorker(workerId: string): CalendarJob{

        var workerJob: CalendarJob;

        this.jobs.forEach(job => {
            if (job.workers.findIndex(w => w.id === workerId) >= 0)
            {
                workerJob = job;
                return;
            }
        });

        return workerJob;
    }

    private _removeWorker(workerId: string, removeFrom: Worker[]){
        var index = removeFrom.findIndex(w => w.id === workerId);

        if(index == -1)
            return;

        return removeFrom.splice(index, 1)[0]
    }
}

export class CalendarDay {
    constructor(public date:Date,
                public isToday: boolean,
                public isPast: boolean,
                public isFuture: boolean,
                public isWeekend: boolean,
                public inMonth: boolean,
                public cssClass?: string
            ){
    }
}

export class CalendarJob implements ITaggedEntity {
    
    public isFiltered: boolean = false;
    public workers: Worker[] = [];
    public tags: Tag[] = [];
    
    public display: string;

    constructor(public id: string,
                public number: string,
                public name: string,
                public notes: string){
        this.display = `${this.number} ${name}`;
    }

    public getDisplayString() : string {
        if(!this.number) {
            return this.name;
        }
        
        return `${this.number} - ${this.name}`;
    }
}

export class JobStartAndEndDate {
    constructor(
       public startDate: Date,
       public endDate: Date){         
    }
}

export class Worker implements IDisplayModel, ITaggedEntity{
    public display: string;
    public isFiltered: boolean = false;

    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public tags: Tag[]
    ){
        this.display = `${this.firstName} ${this.lastName}`;
    }
}

export class WorkerDto implements ITaggedEntity {
    public id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public tags: Tag[];    
}


export class AddWorkerModel {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public tags: Tag[]
    ){
    }
}


export class EditTimeOffModel {
    constructor(
        public workerId: string,
        public monthDate: Date,
        public timeOffDates: Date[]
    ){
    }
}

export class AddJobModel {
    public id: string;
    constructor(
        public number: string,
        public name: string,
        public notes: string,        
        public tags: Tag[],
        public jobDays: Date[]
    ){
        this.id = Guid.newGuid();
    }
}

export class MoveWorkerRequestModel {
    constructor(
        public idWorker: string,
        public idJob: string,
        public date: string,
        public viewDate: Date,
        public addWorkerOption: AddWorkerOption = AddWorkerOption.SingleDay
    ){
    }
}

export class SaveNotesRequestModel {
    constructor(
        public notes: string
    ){
    }
}

export class SaveTagsRequestModel{
    constructor(public idJob: string,
                public tags: Tag[],
                public date?: Date){
                    
                }
}

export interface IDisplayModel{
    display: string;
}

export enum CalendarViews{
    MonthView = 0,
    WeekView = 1,
    DayView = 2
}
