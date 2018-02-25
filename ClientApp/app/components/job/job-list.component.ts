import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core'
import { MatDialog } from '@angular/material';

import { DayView, AddJobModel } from '../calendar/common/models'
import { WorkerAddedJobEvent } from '../calendar/week/week-cell-job.component';
import { AddJobComponent } from './addJob.component';

@Component({
    selector: "ac-job-list",
    templateUrl: "./job-list.component.html",
    styleUrls: ["../calendar/common/calendar-card.scss", "./job-list.component.scss"]
})
export class JobListComponent {
    @Input() dayView: DayView;
    @Input() allowAdd: boolean = true;
    @Input() showHeader: boolean = true;
    @Input() isPast: boolean = false;

    @Output() workerAddedToJob: EventEmitter<WorkerAddedToJobEvent> = new EventEmitter();

    constructor(private dialog: MatDialog ){
    }

    public onWorkerAddedToJob(event: WorkerAddedJobEvent) {

        this.workerAddedToJob.emit({
            worker: event.worker,
            calendarJob: event.calendarJob,
            date: this.dayView.calendarDay.date
        });
    }

    public showAddJob() {
        let dialogRef = this.dialog.open(AddJobComponent, {
            disableClose: true,
            data: {
                model: new AddJobModel(0, '', '', this.dayView.calendarDay.date)
            }
        });
    }
}

export interface WorkerAddedToJobEvent
    extends WorkerAddedJobEvent {
    date: Date
}