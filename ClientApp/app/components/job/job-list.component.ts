import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core'
import { MatDialog } from '@angular/material';

import { DayView, AddJobModel } from '../calendar/common/models'
import { WorkerAddedJobEvent, DeleteJobRequestedEvent, EditJobRequestedEvent } from '../calendar/week/week-cell-job.component';
import { AddJobToWeekViewComponent } from './addJobToWeekViewComponent';

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
    @Input() isReadonly: boolean = false;

    @Output() workerAddedToJob: EventEmitter<WorkerAddedToJobEvent> = new EventEmitter();
    @Output() deleteJobRequested: EventEmitter<DeleteJobRequestedEvent> = new EventEmitter();
    @Output() editJobRequested: EventEmitter<EditJobRequestedEvent> = new EventEmitter();    

    constructor(private dialog: MatDialog ){
    }

    public onWorkerAddedToJob(event: WorkerAddedJobEvent) {

        this.workerAddedToJob.emit({
            worker: event.worker,
            calendarJob: event.calendarJob,
            date: this.dayView.calendarDay.date
        });
    }

    public onDeleteJobRequested(event: DeleteJobRequestedEvent ) {
        this.deleteJobRequested.emit(event);
    }

    public onEditJobRequested(event: EditJobRequestedEvent) {
        this.editJobRequested.emit(event);
    }

    public showAddJob() {
        let dialogRef = this.dialog.open(AddJobToWeekViewComponent, {
            disableClose: true,
            data: {
                isEdit: false,
                editJobId: '',
                jobNumber: '',
                jobName: '',
                notes: '',
                startDate: this.dayView.calendarDay.date,
                endDate: null       
            }
        });
    }
}

export interface WorkerAddedToJobEvent
    extends WorkerAddedJobEvent {
    date: Date
}