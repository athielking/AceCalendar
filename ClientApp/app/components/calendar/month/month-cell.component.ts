import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { TdNotificationCountComponent } from '@covalent/core'

import { DayView, CalendarDay, CalendarJob, Worker, CalendarViews } from '../../calendar/common/models'
import { StorageKeys } from '../common/calendar-tools';
import { StorageService } from '../../../services/storage.service';
import { ViewChangeRequest } from '../../../events/calendar.events';
import { AddWorkerToComponent } from '../../worker/add-worker-to.component';
import { DayViewComponent } from '../day/day-view.component';
import { CalendarStore } from '../../../stores/calendar.store';


@Component({
    selector: 'ac-month-cell',
    templateUrl: './month-cell.component.html',
    styleUrls:['./month-cell.component.scss', 
               '../common/calendar-card.scss']
  })
  
  export class MonthCellComponent implements OnInit {

    @Input() dayView: DayView;
    @Output() changeView: EventEmitter<ViewChangeRequest> = new EventEmitter();

    showAllJobs: boolean;
    showAvailableWorkers: boolean;
    showOffWorkers: boolean;
    showJobTags: boolean;

    constructor(
      private router: Router, 
      private dialog: MatDialog,
      private storageService: StorageService,
      private calendarStore: CalendarStore){
    }

    public ngOnInit(){
      this.storageService.watchStorage().subscribe( key => {
        if(key == StorageKeys.monthViewShowJobs)
          this.showAllJobs = this.storageService.getItem(key) == 'true';

        if(key == StorageKeys.monthViewShowAvailable)
          this.showAvailableWorkers = this.storageService.getItem(key) == 'true';
          
        if( key == StorageKeys.monthViewShowOff)
          this.showOffWorkers = this.storageService.getItem(key) == 'true';

        if( key == StorageKeys.monthViewShowTags)
          this.showJobTags = this.storageService.getItem(key) == 'true';
      });

     
        this.showAllJobs = this.storageService.hasItem(StorageKeys.monthViewShowJobs) && 
                            this.storageService.getItem(StorageKeys.monthViewShowJobs) == 'true';
        
        this.showAvailableWorkers = this.storageService.hasItem(StorageKeys.monthViewShowAvailable) && 
                                    this.storageService.getItem(StorageKeys.monthViewShowAvailable) == 'true';
        
        this.showOffWorkers = this.storageService.hasItem(StorageKeys.monthViewShowOff ) && 
                              this.storageService.getItem(StorageKeys.monthViewShowOff) == 'true'
        
        this.showJobTags = this.storageService.hasItem(StorageKeys.monthViewShowTags ) && 
                              this.storageService.getItem(StorageKeys.monthViewShowTags) == 'true'
    }

    public getJobCount(){
        return this.dayView.jobs.filter(j=> !j.isFiltered).length;
    }

    public getAvailableCount(){
        return this.dayView.availableWorkers.filter( w => !w.isFiltered).length;
    }

    public getTimeOffCount(){
        return this.dayView.timeOffWorkers.filter( w => !w.isFiltered).length;
    }

    public getJobsTooltip(){
      return this.getJobCount().toString() + " Jobs";
    }

    public getAvailableTooltip(){
      return this.getAvailableCount().toString() + " Available Workers";
    }

    public getOffTooltip(){
      return this.getTimeOffCount().toString() + " Off Workers";
    }

    public showDayDetails(){
      let dialogRef = this.dialog.open(DayViewComponent, {
        width: '700px',
        height: '600px',       
        data: {viewDate: this.dayView.calendarDay.date}
      })

      // dialogRef.afterClosed().subscribe(dataUpdated => {
      //   if(dataUpdated)
      //     this.calendarStore.getDataForMonth(this.dayView.calendarDay.date);
      // });
    }

    public goToWeekView(){
      if( this.changeView )
        this.changeView.emit({viewDate: this.dayView.calendarDay.date, view: CalendarViews.WeekView});
    }
  }