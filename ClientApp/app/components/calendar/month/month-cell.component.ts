import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { TdNotificationCountComponent } from '@covalent/core'

import { DayView, CalendarDay, CalendarJob, Worker, CalendarViews } from '../../calendar/common/models'
import { ViewChangeRequest } from '../../../events/calendar.events';
import { AddWorkerToComponent } from '../../worker/add-worker-to.component';
import {DayViewComponent} from '../day/day-view.component';


@Component({
    selector: 'ac-month-cell',
    templateUrl: './month-cell.component.html',
    styleUrls:['./month-cell.component.scss', 
               '../common/calendar-card.scss']
  })
  
  export class MonthCellComponent {

    @Input() dayView: DayView;
    @Input() showAllJobs: Boolean;
    @Output() changeView: EventEmitter<ViewChangeRequest> = new EventEmitter();

    constructor(private router: Router, 
                private dialog: MatDialog){
    }

    public getJobsTooltip(){
      return this.dayView.jobs.length.toString() + " Jobs";
    }

    public getAvailableTooltip(){
      return this.dayView.availableWorkers.length.toString() + " Available Workers";
    }

    public getOffTooltip(){
      return this.dayView.timeOffWorkers.length.toString() + " Off Workers";
    }

    public showDayDetails(){
      this.dialog.open(DayViewComponent, {data: {dayView: this.dayView}})
    }

    public goToWeekView(date: Date){
      if( this.changeView )
        this.changeView.emit({viewDate: date, view: CalendarViews.WeekView});
    }

    public showAddWorkerTo(worker: Worker){
      
      var dialogRef = this.dialog.open(AddWorkerToComponent, {
        data: {
          workers: this.dayView.availableWorkers, 
          jobs: this.dayView.jobs,
          selectedWorker: worker
        }
      });
    }
    
    public goToJob( job: CalendarJob ){
      this.router.navigate(['job', job.id]);
      console.log("navigating to job " + job.id);
    }
  }