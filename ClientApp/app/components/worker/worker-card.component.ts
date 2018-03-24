import {Component, Input, EventEmitter, Output} from '@angular/core'

import {Worker, CalendarJob} from '../calendar/common/models'
import { Router } from '@angular/router';

@Component({
    selector: "ac-worker-card",
    templateUrl: "./worker-card.component.html",
    styleUrls: ["./worker-card.component.scss"]
})
export class WorkerCardComponent{
    @Input() worker: Worker;
    @Input() jobs: CalendarJob[];
    @Input() scope: string;
    @Input() isReadonly: boolean = false;
    @Input() showMoveToAvailable: boolean = false;
    @Input() showMoveToTimeOff: boolean = false;

    @Output() addToJobRequested: EventEmitter<WorkerAddedJobEvent> = new EventEmitter();
    @Output() addToAvailableRequested: EventEmitter<WorkerMovedEvent> = new EventEmitter();
    @Output() addToTimeOffRequested: EventEmitter<WorkerMovedEvent> = new EventEmitter();

    public dragging: Boolean = false;

    constructor(
        private router: Router
    ) {
    } 

    public addWorkerToJob(worker: Worker, job: CalendarJob){
        this.addToJobRequested.emit({
            calendarJob: job,
            worker: worker
        });
    }

    public addToAvailable(worker: Worker){
        this.addToAvailableRequested.emit({
            worker: worker
        });
    }

    public addToTimeOff(worker: Worker){
        this.addToTimeOffRequested.emit({
            worker: worker
        });
    }

    public viewWorker(worker: Worker){
        this.router.navigate(['worker', worker.id]);
    }

    public onDragStart(e: any){
        this.dragging = true;
    }

    public onDragEnd(e: any){
        this.dragging = false;
    }
}

export interface WorkerAddedJobEvent extends WorkerMovedEvent {
    calendarJob: CalendarJob
}

export interface WorkerMovedEvent {
    worker: Worker
}