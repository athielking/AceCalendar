import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { JobService } from '../services/job.service';
import { CalendarDay, CalendarJob, AddJobModel } from '../components/calendar/common/models';

@Injectable()
export class JobStore{
    private _jobs : BehaviorSubject<List<CalendarJob>> = new BehaviorSubject(List([]));

    public readonly jobs : Observable<List<CalendarJob>> = this._jobs.asObservable();

    constructor(private jobService: JobService){
    }

    getJobs(){
        this.jobService.getJobs()
            .subscribe( result => this._jobs.next(List(result)));
    }

    addJob(job: AddJobModel){

        let obs = this.jobService.addJob(job);

        obs.subscribe(
            result => {
                this.getJobs();
            });

        return obs;
    }

    deleteWorker(jobId: string){
        var obs = this.jobService.deleteJob(jobId);

        obs.subscribe( response => {
            this.getJobs();
        })
        
        return obs;
    }

}