import { Component, Input, Output, Inject, Optional, OnInit, EventEmitter, OnDestroy } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { CalendarJob, Worker, CalendarDay } from '../../calendar/common/models'
import { JobNotesComponent } from '../../job/jobNotes.component';
import { WorkerMovedWithDateEvent } from '../../worker/worker-list.component';
import { StorageService } from '../../../services/storage.service';
import { StorageKeys } from '../common/calendar-tools';
import { JobCollapseService } from '../../../services/job-collapse.service';

@Component({
    selector: 'ac-week-cell-job',
    templateUrl: './week-cell-job.component.html',
    styleUrls: ['./week-cell-job.component.scss'],
    animations: [
        trigger('expandCollapse', [
            state('expandCollapseState', style({height: '*'})),
            transition('* => void', [style({height: '*'}), animate(200, style({height: '0'}))]),
            transition('void => *', [style({height: '0'}), animate(200, style({height: "*"}))])
        ])
    ]
})
export class WeekCellJobComponent implements OnInit, OnDestroy {
    @Input() calendarJob: CalendarJob;
    @Input() calendarDay: CalendarDay;
    @Input() isReadonly: boolean = false;
    @Output() workerAdded: EventEmitter<WorkerAddedJobEvent> = new EventEmitter();
    @Output() deleteJobDayRequested: EventEmitter<DeleteJobDayRequestedEvent> = new EventEmitter();
    @Output() editJobRequested: EventEmitter<EditJobRequestedEvent> = new EventEmitter();    
    @Output() dayJobTagRequested: EventEmitter<DayJobTagRequestedEvent> = new EventEmitter();

    @Output() addToAvailableRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();
    @Output() addToTimeOffRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();
    
    public collapsed: boolean = false;
    private storageSub: Subscription;

    constructor(private snackBar: MatSnackBar,
                private storageService: StorageService,
                private jobCollapseService: JobCollapseService,
                @Optional() @Inject(MAT_DIALOG_DATA) data) {

        if(data){
            if( data.calendarJob )
                this.calendarJob = data.calendarJob;
            if( data.calendarDay )
                this.calendarDay = data.calendarDay;
            if(data.isReadonly)
                this.isReadonly = data.isReadonly;
        }
    }

    ngOnInit(){
        
        this.collapsed = this.jobCollapseService.isCollapsed(this.calendarDay.date, this.calendarJob.id);

        this.storageSub = this.jobCollapseService.collapsedJobs.subscribe( result => {
            this.collapsed = this.jobCollapseService.isCollapsed(this.calendarDay.date, this.calendarJob.id);
        })
    }

    ngOnDestroy(){
        this.storageSub.unsubscribe();
    }

    public onWorkerDropped(e: any) {

        this.workerAdded.emit({
            calendarJob: this.calendarJob,
            worker: <Worker>e.dragData
        });

    }

    public showNotes() {
        var ref = this.snackBar.openFromComponent(JobNotesComponent, 
            { 
                data: { 
                    model: this.calendarJob, 
                    allowEdit: !this.isReadonly 
                } 
        });
    }

    public editJob(job: CalendarJob) {
        this.editJobRequested.emit({
            job: job,
            date: this.calendarDay.date
        });
    } 

    public deleteJob(jobId: string) {

        this.deleteJobDayRequested.emit({
            jobId: jobId,
            date: this.calendarDay.date
        });
    }

    public addDayJobTag(job: CalendarJob){
        
        this.dayJobTagRequested.emit({
            job: job,
            date: this.calendarDay.date
        });
    }
    
    public onAddToAvailableRequested(event: WorkerMovedWithDateEvent) {
        this.addToAvailableRequested.emit({
            worker: event.worker,
            date: this.calendarDay.date
        });
    }

    public onAddToTimeOffRequested(event: WorkerMovedWithDateEvent) {
        this.addToTimeOffRequested.emit({
            worker: event.worker,
            date: this.calendarDay.date
        });
    }

    public toggleCollapse(){
        this.jobCollapseService.toggleCollapse(this.calendarDay.date, this.calendarJob.id);
    }
}

export interface WorkerAddedJobEvent {
    calendarJob: CalendarJob,
    worker: Worker,
}

export interface EditJobRequestedEvent {
    job: CalendarJob,
    date: Date
}

export interface DayJobTagRequestedEvent {
    job: CalendarJob,
    date: Date
}

export interface DeleteJobDayRequestedEvent {
    jobId: string, 
    date: Date
}