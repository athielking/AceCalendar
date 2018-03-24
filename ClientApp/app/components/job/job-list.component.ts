import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core'
import { MatDialog } from '@angular/material';

import { DayView, AddJobModel } from '../calendar/common/models'
import { WorkerAddedJobEvent, DeleteJobRequestedEvent, EditJobRequestedEvent, DayJobTagRequestedEvent } from '../calendar/week/week-cell-job.component';
import { AddJobToWeekViewComponent } from './addJobToWeekViewComponent';
import { WorkerMovedWithDateEvent } from '../worker/worker-list.component';

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
    @Output() dayJobTagRequested: EventEmitter<DayJobTagRequestedEvent> = new EventEmitter();
    @Output() addToAvailableRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();
    @Output() addToTimeOffRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();

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

    public onDayJobTagRequested(event: DayJobTagRequestedEvent){
        this.dayJobTagRequested.emit(event);
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

    public onAddToAvailableRequested(event: WorkerMovedWithDateEvent) {
        this.addToAvailableRequested.emit(event);
    }

    public onAddToTimeOffRequested(event: WorkerMovedWithDateEvent) {
        this.addToTimeOffRequested.emit(event);
    }
}

export interface WorkerAddedToJobEvent
    extends WorkerAddedJobEvent {
    date: Date
}