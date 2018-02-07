import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';

import { DayView, CalendarDay, CalendarJob, Worker, AddJobModel } from '../../calendar/common/models'
import { CalendarCellComponent } from '../common/calendar-cell.component';
import { WorkerAddedJobEvent } from './week-cell-job.component';
import { AddJobComponent } from '../../job/addJob.component';

@Component({
    selector: 'ac-week-cell',
    templateUrl: './week-cell.component.html',
    styleUrls: ['./week-cell.component.scss']
})
export class WeekCellComponent extends CalendarCellComponent {
    @Output() workerMoved: EventEmitter<WorkerMovedEvent> = new EventEmitter();

    constructor(private dialog: MatDialog) {
        super();
    }
    
    onWorkerDropped(e: any) {
        let worker: Worker = <Worker>e.dragData;

        this.dayView.jobs.forEach(job => {
            var index = job.workers.indexOf(worker);
            if (index >= 0) {
                job.workers.splice(index, 1);
                return;
            }
        });
        this.dayView.availableWorkers.push(worker);

        this.workerMoved.emit({
            worker: worker,
            calendarJob: null,
            date: this.dayView.calendarDay.date
        })
    }

    onWorkerAddedToJob(event: WorkerAddedJobEvent) {

        if (this.dayView.availableWorkers.indexOf(event.worker) >= 0) {
            this.dayView.availableWorkers.splice(
                this.dayView.availableWorkers.indexOf(event.worker), 1
            );
        }
        else {
            this.dayView.jobs.forEach(job => {
                var index = job.workers.indexOf(event.worker);
                if (index >= 0) {
                    job.workers.splice(index, 1);
                    return;
                }
            });
        }

        var jobIndex = this.dayView.jobs.indexOf(event.calendarJob);
        if (jobIndex >= 0)
            this.dayView.jobs[jobIndex].workers.push(event.worker);

        this.workerMoved.emit({
            worker: event.worker,
            calendarJob: event.calendarJob,
            date: this.dayView.calendarDay.date
        });
    }

    showAddJob() {
        let dialogRef = this.dialog.open(AddJobComponent, {
            disableClose: true,
            data: {
                model: new AddJobModel(0, '', '', this.dayView.calendarDay.date)
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            //this.load();
        });
    }
}

export interface WorkerMovedEvent
    extends WorkerAddedJobEvent {
    date: Date
}