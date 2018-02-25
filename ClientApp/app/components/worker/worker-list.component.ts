import {Component, Input, Output, EventEmitter} from '@angular/core'

import {Worker, CalendarDay} from '../calendar/common/models'
import { WorkerListAdded } from '../../events/worker.events';

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
    
    @Output() workerAdded: EventEmitter<WorkerListAdded> = new EventEmitter();

    constructor(){
    }

    onDropped(e: any){

        this.workerAdded.emit({
            worker: <Worker>e.dragData,
            date: this.calendarDay.date
        });
    }
}