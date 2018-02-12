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

    onWorkerDropped(e: any) {

        //let worker: Worker = <Worker>e.dragData;

        // jobFrom.workers = jobFrom.workers.splice( jobFrom.workers.indexOf(worker), 1);
        //this.calendarJob.workers.push(worker);

        this.workerAdded.emit({
            calendarJob: this.calendarJob,
            worker: <Worker>e.dragData
        });

    }

    showNotes() {
        var ref = this.snackBar.openFromComponent(JobNotesComponent, { data: { model: this.calendarJob } });
    }

    showWorkerMenu(e: any){
        alert("Test")
        return false;
    }
}

export interface WorkerAddedJobEvent {
    calendarJob: CalendarJob,
    worker: Worker,
}