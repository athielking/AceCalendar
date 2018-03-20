import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { CalendarJob, Worker, CalendarDay } from '../../calendar/common/models'
import { MatSnackBar } from '@angular/material';
import { JobNotesComponent } from '../../job/jobNotes.component';
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
    @Output() deleteJobRequested: EventEmitter<DeleteJobRequestedEvent> = new EventEmitter();
    @Output() editJobRequested: EventEmitter<EditJobRequestedEvent> = new EventEmitter();    
    @Output() addToAvailableRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();
    @Output() addToTimeOffRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();
    
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
    job: CalendarJob
}

export interface DeleteJobRequestedEvent {
    jobId: string
}