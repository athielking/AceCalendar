import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { JobService } from '../services/job.service';
import { CalendarDay, CalendarJob } from '../components/calendar/common/models';

@Injectable()
export class JobStore{
    private _jobs : BehaviorSubject<List<CalendarJob>> = new BehaviorSubject(List([]));

    public readonly jobs : Observable<List<CalendarJob>> = this._jobs.asObservable();
    public date : Date;

    constructor(private jobService: JobService){
    }

    initialize(date: Date){
        this.date = date;

        this.jobService.getJobsForDay(this.date)
            .subscribe(
                result => {
                    this._jobs.next(List(result));
                },
                err => console.log("Error retrieving Jobs")
            );
    }

    addJob(job: CalendarJob){

        this.jobService.addJob(job)
            .subscribe(
                result => 
                    this._jobs.next(this._jobs.getValue().push(job))
            );
    }

}