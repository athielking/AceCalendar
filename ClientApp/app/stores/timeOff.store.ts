import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { WorkerService } from '../services/worker.service';
import { TimeOffGridModel } from '../models/worker/timeOffGridModel';
import { WorkerJobsStore } from './workerJobs.store';
import { CalendarStore } from './calendar.store';

@Injectable()
export class TimeOffStore{

    private _timeOffData : BehaviorSubject<TimeOffGridModel[]> = new BehaviorSubject([]);

    public errorMessage : string;

    public hasError : BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading : BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly timeOffData : Observable<TimeOffGridModel[]> = this._timeOffData.asObservable();
    
    constructor(
        private workerService: WorkerService,
        private workerJobsStore: WorkerJobsStore,
        private calendarStore: CalendarStore){
    }

    public getTimeOffData(workerId: string, date: Date){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.workerService.getTimeOffData(workerId, date).subscribe( result => {
            this._timeOffData.next(result);
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public deleteTimeOff( workerId: string, timeOffGridModel: TimeOffGridModel) {
        this.isLoading.next(true);
        this.hasError.next(false);

        var obs = this.workerService.deleteTimeOff(workerId, timeOffGridModel.date);

        obs.subscribe( response => {
            this.isLoading.next(false);
            this.removeTimeOffModel(workerId, timeOffGridModel);
        }, error => {
            this.isLoading.next(false);
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });

        return obs;
    }

    public editTimeOff(workerId: string, monthDate: Date, timeOffDates: Date[]) {

        this.isLoading.next(true);
        this.hasError.next(false);

        var obs = this.workerService.editTimeOff(workerId, monthDate, timeOffDates);
        
        obs.subscribe( response => {
            this.isLoading.next(false);
            this.updateTimeOffDates(workerId, timeOffDates);
        }, error => {
            this.isLoading.next(false);
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });

        return obs;
    }

    private removeTimeOffModel(workerId: string, timeOffGridModel: TimeOffGridModel) {
        var timeOffGridModels = this._timeOffData.value.filter( function(model: TimeOffGridModel) {
            return model.date !== timeOffGridModel.date;
        })
        
        this._timeOffData.next(timeOffGridModels);

        this.calendarStore.makeWorkerAvailable(workerId, timeOffGridModel.date);
    }

    private updateTimeOffDates(workerId: string, timeOffDates: Date[]) {
        var dates = timeOffDates.map( date => new Date(date).getDate() );

        //Remove existing time off days from calendar store
        for( let timeOffModel of this._timeOffData.value  ) {
            if( !dates.includes( new Date(timeOffModel.date).getDate() ) ) 
                this.calendarStore.makeWorkerAvailable(workerId, timeOffModel.date);           
        }
        
        //Add new time off entries to calendar store
        for( let timeOffDate of timeOffDates ) {
            this.calendarStore.addTimeOff(workerId, timeOffDate);
        }

        var timeOffGridModels = timeOffDates.map( date => {
            var timeOffGridModel = new TimeOffGridModel();
            timeOffGridModel.date = date;
            return timeOffGridModel;            
        });
        
        this._timeOffData.next(timeOffGridModels);

        //Remove worker jobs for new time off entries from worker jobs store
        this.workerJobsStore.updateTimeOffDates( timeOffDates );
    }
}