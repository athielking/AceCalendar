import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import {AddWorkerOption}  from '../../../models/shared/calendar-options';
import * as calendarTools from '../../../components/calendar/common/calendar-tools';
import {Tag} from '../../../models/tag/tag.model';
import {Guid} from '../../../tools/guid';

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

    public makeWorkerAvailable( worker: Worker ){

        if(this.workerIsAvailable(worker))
            return;

        if(this.workerIsOff(worker))
            this._removeWorker(worker, this.timeOffWorkers);
        else {
            var job = this.findJobForWorker(worker);
            this._removeWorker(worker, job.workers);
        }

        this.availableWorkers.push(worker);
    }

    public makeWorkerOff( worker: Worker){
        if(this.workerIsOff(worker))
            return;

        if(this.workerIsAvailable(worker))
            this._removeWorker(worker, this.availableWorkers);
        else {
            var job = this.findJobForWorker(worker);
            this._removeWorker(worker, job.workers);
        }
        
        this.timeOffWorkers.push(worker);
    }

    public addWorkerToJob( worker: Worker, calendarJob: CalendarJob){

        let jobTo = this.jobs.find( j => j.id === calendarJob.id );
        if( !jobTo )
            return;

        let removed: Worker;
        if( this.workerIsAvailable(worker)){
            removed = this._removeWorker( worker, this.availableWorkers );
        }
        else if( this.workerIsOff(worker)){
            removed = this._removeWorker(worker, this.timeOffWorkers);
        }
        else{
            var jobFrom = this.findJobForWorker(worker);
            removed = this._removeWorker(worker, jobFrom.workers);
        }

        jobTo.workers.push(removed);
    }

    public workerIsAvailable(worker: Worker): Boolean{
        return this.availableWorkers.findIndex( w => w.id === worker.id) > -1;
    }
    
    public workerIsOff(worker: Worker): Boolean{
        return this.timeOffWorkers.findIndex(w => w.id === worker.id) > -1;
    }

    public findJobForWorker(worker: Worker): CalendarJob{

        var workerJob: CalendarJob;

        this.jobs.forEach(job => {
            if (job.workers.findIndex(w => w.id === worker.id) >= 0)
            {
                workerJob = job;
                return;
            }
        });

        return workerJob;
    }

    private _removeWorker(worker: Worker, removeFrom: Worker[]){
        var index = removeFrom.findIndex(w => w.id === worker.id);

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

export class CalendarJob implements IDisplayModel{
    public workers: Worker[] = [];
    public jobTags: Tag[] = [];
    
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

export class Worker implements IDisplayModel{
    public timeOff: Date[] = [];
    public jobs: CalendarJob[] = [];
    
    public display: string;
    constructor(public id: string,
                public firstName: string,
                public lastName: string,
                public email: string,
                public phone: string){
        this.display = `${this.firstName} ${this.lastName}`;
    }
}

export class AddWorkerModel {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string
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
        public date: Date,
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
