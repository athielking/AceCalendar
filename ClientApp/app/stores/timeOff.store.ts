import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { WorkerService } from '../services/worker.service';
import { TimeOffGridModel } from '../models/worker/timeOffGridModel';

@Injectable()
export class TimeOffStore{

    private _timeOffData : BehaviorSubject<TimeOffGridModel[]> = new BehaviorSubject([]);

    public errorMessage : string;

    public hasError : BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading : BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly timeOffData : Observable<TimeOffGridModel[]> = this._timeOffData.asObservable();
    
    constructor(private workerService: WorkerService){
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
            this.removeTimeOffModel(timeOffGridModel);
        }, error => {
            this.isLoading.next(false);
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });

        return obs;
    }

    private removeTimeOffModel(timeOffGridModel: TimeOffGridModel) {
        var timeOffGridModels = this._timeOffData.value.filter( function(model: TimeOffGridModel) {
            return model.date !== timeOffGridModel.date;
        })
        
        this._timeOffData.next(timeOffGridModels);
    }
    // public addTimeOff(workerId: string, date: Date, end?: Date): Observable<Worker>{

    //     this.isLoading.next(true);
    //     this.hasError.next(false);

    //     var obs = this.workerService.addTimeOff(workerId, date, end);

    //     obs.subscribe( response => {
    //         this.isLoading.next(false);
    //         if( this._worker.getValue().id == response.id )
    //             this._worker.next(response);
    //     }, error => {
    //         this.isLoading.next(false);
    //         this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
    //         this.hasError.next(true);
    //     });

    //     return obs;
    // }
}