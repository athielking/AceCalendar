import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { JobService } from '../services/job.service';
import { CalendarDay, CalendarJob, AddJobModel } from '../components/calendar/common/models';

@Injectable()
export class JobStore{
    private _jobs : BehaviorSubject<CalendarJob[]> = new BehaviorSubject([]);

    public readonly jobs : Observable<CalendarJob[]> = this._jobs.asObservable();

    constructor(private jobService: JobService){
    }

    getJobs(){
        this.jobService.getJobs()
            .subscribe( result => this._jobs.next(result));
    }

    addJob(job: AddJobModel){

        let obs = this.jobService.addJob(job);

        obs.subscribe(
            result => {
                let jobs = this._jobs.getValue();
                jobs.push(result);
                
                this._jobs.next( jobs );
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