import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Rx';

import { DayView, CalendarDay, CalendarJob, Worker } from '../../calendar/common/models'
import { CalendarCellComponent } from '../common/calendar-cell.component';
import { WorkerAddedJobEvent } from './week-cell-job.component';

@Component({
  selector: 'ac-week-cell',
  templateUrl: './week-cell.component.html',
  styleUrls: ['./week-cell.component.scss']
})
export class WeekCellComponent extends CalendarCellComponent {
  @Output() workerMoved: EventEmitter<WorkerMovedEvent> = new EventEmitter();

  onWorkerDropped(e: any) {
    this.dayView.availableWorkers.push(e.dragData);
  }

  onWorkerAddedToJob(event: WorkerAddedJobEvent) {
    console.log(event);

    this.workerMoved.emit({
      worker: event.worker, 
      calendarJob: event.calendarJob, 
      date: this.dayView.calendarDay.date
    });
  }
}

export interface WorkerMovedEvent 
  extends WorkerAddedJobEvent{
  date: Date
}