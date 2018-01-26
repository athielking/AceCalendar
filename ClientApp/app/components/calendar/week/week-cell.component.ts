import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Rx';
import {MatDialog} from '@angular/material';

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

  constructor(private dialog: MatDialog){
    super();
  }

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

  showAddJob(){
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
  extends WorkerAddedJobEvent{
  date: Date
}