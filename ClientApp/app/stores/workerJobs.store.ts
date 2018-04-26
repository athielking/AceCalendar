import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { WorkerService } from '../services/worker.service';
import { JobByDateGridModel } from '../models/worker/jobByDateGridModel';

@Injectable()
export class WorkerJobsStore{

    private _workerJobsData : BehaviorSubject<JobByDateGridModel[]> = new BehaviorSubject([]);

    public errorMessage : string;

    public hasError : BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading : BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly workerJobsData : Observable<JobByDateGridModel[]> = this._workerJobsData.asObservable();
    
    constructor(private workerService: WorkerService){
    }

    public getWorkerJobsData(workerId: string, date: Date){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.workerService.getWorkerJobs(workerId, date).subscribe( result => {
            this._workerJobsData.next(result);
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public updateTimeOffDates( timeOffDates: Date[] ){
        var dates = timeOffDates.map( date => new Date(date).getDate() );

        var workerJobsData = this._workerJobsData.value.filter( job => !dates.includes( new Date(job.date).getDate() ) );

        this._workerJobsData.next(workerJobsData);
    }
}