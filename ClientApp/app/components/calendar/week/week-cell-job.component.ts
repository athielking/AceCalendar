import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { CalendarJob, Worker, CalendarDay } from '../../calendar/common/models'
import { MatSnackBar } from '@angular/material';
import { JobNotesComponent } from '../../job/jobNotes.component';

@Component({
    selector: 'ac-week-cell-job',
    templateUrl: './week-cell-job.component.html',
    styleUrls: ['./week-cell-job.component.scss']
})
export class WeekCellJobComponent {
    @Input() calendarJob: CalendarJob;
    @Input() calendarDay: CalendarDay;
    @Output() workerAdded: EventEmitter<WorkerAddedJobEvent> = new EventEmitter();
    @Output() deleteJobRequested: EventEmitter<DeleteJobRequestedEvent> = new EventEmitter();
    @Output() editJobRequested: EventEmitter<EditJobRequestedEvent> = new EventEmitter();    

    constructor(private snackBar: MatSnackBar) {
    }

    public onWorkerDropped(e: any) {

        this.workerAdded.emit({
            calendarJob: this.calendarJob,
            worker: <Worker>e.dragData
        });

    }

    public showNotes() {
        var ref = this.snackBar.openFromComponent(JobNotesComponent, { data: { model: this.calendarJob } });
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