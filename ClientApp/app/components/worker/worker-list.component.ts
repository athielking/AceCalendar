import {Component, Input, Output, EventEmitter} from '@angular/core'

import {Worker, CalendarDay, CalendarJob} from '../calendar/common/models'
import { WorkerListAdded } from '../../events/worker.events';
import { WorkerAddedJobEvent, WorkerMovedEvent } from './worker-card.component';

@Component({
    selector: "ac-worker-list",
    templateUrl: "./worker-list.component.html",
    styleUrls: ["../calendar/common/calendar-card.scss", "./worker-list.component.scss"]
})
export class WorkerListComponent {
    @Input() headerText: string;
    @Input() calendarDay: CalendarDay;
    @Input() isAccent: Boolean = false;
    @Input() isPast: Boolean = false;
    @Input() workers: Worker[];
    @Input() jobs: CalendarJob[];
    @Input() showMoveToAvailable: boolean = false;
    @Input() showMoveToTimeOff: boolean = false;

    @Output() workerAdded: EventEmitter<WorkerListAdded> = new EventEmitter();
    @Output() addToJobRequested: EventEmitter<WorkerAddedToJobEvent> = new EventEmitter();    
    @Output() addToAvailableRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();
    @Output() addToTimeOffRequested: EventEmitter<WorkerMovedWithDateEvent> = new EventEmitter();

    constructor(){
    }

    public onDropped(e: any){

        this.workerAdded.emit({
            worker: <Worker>e.dragData,
            date: this.calendarDay.date
        });
    }

    public onAddToJobRequested(event: WorkerAddedJobEvent) {
        this.addToJobRequested.emit({
            worker: event.worker,
            calendarJob: event.calendarJob,
            date: this.calendarDay.date
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

export interface WorkerAddedToJobEvent
    extends WorkerAddedJobEvent {
    date: Date
}

export interface WorkerMovedWithDateEvent
    extends WorkerMovedEvent {
    date: Date
}