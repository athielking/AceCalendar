import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { CalendarJob, Worker } from '../../calendar/common/models'


@Component({
    selector: 'ac-week-cell-job',
    templateUrl: './week-cell-job.component.html',
    styleUrls: ['./week-cell-job.component.scss']
})
export class WeekCellJobComponent {
    @Input() calendarJob: CalendarJob;
    @Output() workerAdded: EventEmitter<WorkerAddedJobEvent> = new EventEmitter()

    onWorkerDropped(e: any) {

        let worker: Worker = <Worker>e.dragData;

        // jobFrom.workers = jobFrom.workers.splice( jobFrom.workers.indexOf(worker), 1);
        this.calendarJob.workers.push(worker);

        this.workerAdded.emit({
            calendarJob: this.calendarJob,
            worker: <Worker>e.dragData
        });
    
    }
}

export interface WorkerAddedJobEvent {
    calendarJob: CalendarJob,
    worker: Worker,
}