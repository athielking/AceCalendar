import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { JobService } from '../services/job.service';
import { CalendarDay, CalendarJob, AddJobModel, SaveNotesRequestModel, SaveTagsRequestModel } from '../components/calendar/common/models';
import {Tag} from '../models/tag/tag.model';

@Injectable()
export class JobStore{
    private _jobs : BehaviorSubject<CalendarJob[]> = new BehaviorSubject([]);

    public errorMessage: string;

    public hasError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly jobs : Observable<CalendarJob[]> = this._jobs.asObservable();

    constructor(private jobService: JobService){
    }

    public getJobs(){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.jobService.getJobs().subscribe( result => {
            this._jobs.next(result);
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public addJob(addJobModel: AddJobModel){
        var obs = this.jobService.addJob(addJobModel);

        obs.subscribe( response => { 
            this.getJobs();
        }, error => {
        });

        return obs;
    }

    public deleteJob(jobId: string){
        var obs = this.jobService.deleteJob(jobId);

        obs.subscribe( response => {
            this.getJobs();
        }, error => {
        })
        
        return obs;
    }

    public saveNotes( jobId: string, notes: string){       
        return this.jobService.saveNotes(jobId, new SaveNotesRequestModel(notes));
    }

    public saveTags( jobId: string, tags: Tag[], date?: Date){
        return this.jobService.saveTags( jobId, new SaveTagsRequestModel(jobId, tags, date));
    }
}