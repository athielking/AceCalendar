import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { CalendarJob, Worker, CalendarDay } from '../../calendar/common/models'
import { MatSnackBar } from '@angular/material';
import { JobNotesComponent } from '../../job/jobNotes.component';
import {Tag} from '../../../models/tag/tag.model';

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
    @Output() deleteJobRequested: EventEmitter<DeleteJobRequestedEvent> = new EventEmitter();
    @Output() editJobRequested: EventEmitter<EditJobRequestedEvent> = new EventEmitter();    
    @Output() dayJobTagRequested: EventEmitter<DayJobTagRequestedEvent> = new EventEmitter();

    constructor(private snackBar: MatSnackBar) {
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
            job: job
        });
    } 

    public deleteJob(jobId: string) {

        this.deleteJobRequested.emit({
            jobId: jobId
        });
    }

    public addDayJobTag(job: CalendarJob){
        
        this.dayJobTagRequested.emit({
            job: job,
            date: this.calendarDay.date
        });
    }
}

export interface WorkerAddedJobEvent {
    calendarJob: CalendarJob,
    worker: Worker,
}

export interface EditJobRequestedEvent {
    job: CalendarJob
}

export interface DayJobTagRequestedEvent {
    job: CalendarJob,
    date: Date
}

export interface DeleteJobRequestedEvent {
    jobId: string
}