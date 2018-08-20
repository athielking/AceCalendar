import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import {DayView, Worker, CalendarJob} from '../calendar/common/models';

@Component({
    selector: 'ac-add-worker-to',
    templateUrl: './add-worker-to.component.html',
    //styleUrls: ['./add-worker-to.component.scss']
})
export class AddWorkerToComponent implements OnInit {
    @Input() workers : Worker[];
    @Input() jobs: CalendarJob[];
    @Input() selectedWorker: Worker;
    
    filteredWorkers: Observable<Worker[]>;
    filteredJobs: Observable<CalendarJob[]>;

    workerControl = new FormControl();
    jobControl = new FormControl();

    constructor(@Inject(MAT_DIALOG_DATA) public data: any ){
        if(data.workers)
            this.workers = <Worker[]>data.workers

        if(data.jobs)
            this.jobs = <CalendarJob[]>data.jobs;
        
        if(data.selectedWorker)
            this.selectedWorker = <Worker>data.selectedWorker;
    }

    ngOnInit(){
        this.filteredWorkers = this.workerControl.valueChanges.pipe(
            startWith<string | Worker>(''), 
            map( value => typeof value === 'string' ? value : value.display),
            map(display => display ? this.filterWorkers(display) : this.workers.slice())
        );
        
        this.filteredJobs = this.jobControl.valueChanges.pipe(
            startWith<string | CalendarJob>(''),
            map( value => typeof value === 'string' ? value : value.display ),
            map(display => display ? this.filterJobs(display) : this.jobs.slice())
        );
        
        if(this.selectedWorker)
        {
            this.workerControl.setValue(this.selectedWorker);
        }
    }

    filterWorkers(display: string){
        return this.workers.filter( worker => worker.display.toLowerCase().indexOf(display.toLowerCase())===0);
    }

    filterJobs(display: string){
        return this.jobs.filter( job => job.display.toLowerCase().indexOf(display.toLowerCase())===0);
    }

    workerDisplay(worker?: Worker){
        return worker ? worker.display : undefined;
    }

    jobDisplay(job?: CalendarJob){
        return job ? job.display : undefined;
    }
}