import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import {AddWorkerOption}  from '../../../models/shared/calendar-options';

export class MonthView{
    constructor(public header: CalendarDay[],
                public daysOfMonth: CalendarDay[]){
    }
}

export class DayView{

    public workersByJob : Map<string, Worker[]>;
    
    constructor(public calendarDay: CalendarDay, 
                public jobs: CalendarJob[],
                public availableWorkers: Worker[],
                public timeOffWorkers: Worker[])
                {
                }

    public makeWorkerAvailable( worker: Worker ){

        if(this._workerIsAvailable(worker))
            return;

        if(this._workerIsOff(worker))
            this._removeWorker(worker, this.timeOffWorkers);
        else {
            var job = this._findJobForWorker(worker);
            this._removeWorker(worker, job.workers);
        }

        this.availableWorkers.push(worker);
    }

    public makeWorkerOff( worker: Worker){
        if(this._workerIsOff(worker))
            return;

        if(this._workerIsAvailable(worker))
            this._removeWorker(worker, this.availableWorkers);
        else {
            var job = this._findJobForWorker(worker);
            this._removeWorker(worker, job.workers);
        }
        
        this.timeOffWorkers.push(worker);
    }

    public addWorkerToJob( worker: Worker, calendarJob: CalendarJob){
        if( this._workerIsAvailable(worker)){
            this._removeWorker( worker, this.availableWorkers );
        }
        else if( this._workerIsOff(worker)){
            this._removeWorker(worker, this.timeOffWorkers);
        }
        else{
            var jobFrom = this._findJobForWorker(worker);
            this._removeWorker(worker, jobFrom.workers);
        }

        calendarJob.workers.push(worker);
    }

    private _workerIsAvailable(worker: Worker): Boolean{
        return this.availableWorkers.indexOf(worker) > -1;
    }
    
    private _workerIsOff(worker: Worker): Boolean{
        return this.timeOffWorkers.indexOf(worker) > -1;
    }

    private _findJobForWorker(worker: Worker): CalendarJob{

        let workerJob: CalendarJob;

        this.jobs.forEach(job => {
            if (job.workers.indexOf(worker) >= 0)
            {
                workerJob = job;
                return;
            }
        });

        return workerJob;
    }

    private _removeWorker(worker: Worker, removeFrom: Worker[]){
        var index = removeFrom.indexOf(worker);

        if(index == -1)
            return;

        removeFrom.splice(index, 1);
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
    public display: string;

    constructor(public id: string,
                public number: number,
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
    constructor(
        public number: string,
        public name: string,
        public notes: string,        
        public startDate: Date,
        public endDate: Date,
    ){
    }
}

export class MoveWorkerRequestModel {
    constructor(
        public idWorker: string,
        public idJob: string,
        public date: Date,
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

export interface IDisplayModel{
    display: string;
}

export enum CalendarViews{
    MonthView = 0,
    WeekView = 1,
    DayView = 2
}
