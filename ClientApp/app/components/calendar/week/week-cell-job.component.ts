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
    @Output() workerAdded: EventEmitter<WorkerAddedJobEvent> = new EventEmitter()

    constructor(public snackBar: MatSnackBar) {
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
        alert('Edit ' + job.id);
    } 

    public deleteJob(jobId: string) {
        alert('Delete ' + jobId);
    }
}

export interface WorkerAddedJobEvent {
    calendarJob: CalendarJob,
    worker: Worker,
}