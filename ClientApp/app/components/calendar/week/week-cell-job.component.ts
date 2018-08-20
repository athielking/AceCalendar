import { Component, Input, Output, Inject, Optional, OnInit, EventEmitter } from '@angular/core'
import { CalendarJob, Worker, CalendarDay } from '../common/models'
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { JobNotesComponent } from '../../job/jobNotes.component';
import {Tag} from '../../../models/tag/tag.model';
import { WorkerMovedWithDateEvent } from '../../worker/worker-list.component';

@Component({
    selector: 'ac-week-cell-job',
    templateUrl: './week-cell-job.component.html',
    styleUrls: ['./week-cell-job.component.scss']
})
export class WeekCellJobComponent {
    @Input() calendarJob: CalendarJob;
    @Input() calendarDay: CalendarDay;
    @Input() isReadonly: boolean = false;
    @Output() workerAdded: EventEmitter<WorkerAddedJobEvent> = new EventEmitter();
    @Output() deleteJobDayRequested: EventEmitter<DeleteJobDayRequestedEvent> = new EventEmitter();
    @Output() editJobRequested: EventEmitter<EditJobRequestedEvent> = new EventEmitter();    
    @Output() dayJobTagRequested: EventEmitter<DayJobTagRequestedEvent> = new EventEmitter();

    @Output() addToAvailableRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();
    @Output() addToTimeOffRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();
    
    constructor(private snackBar: MatSnackBar,
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