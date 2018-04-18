import { Component, Input, Output, OnInit,OnChanges, SimpleChanges, EventEmitter, ViewChild } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { MatDialog } from '@angular/material'
import { Observable } from 'rxjs/Rx';

import { getWeekHeaderDays } from '../../calendar/common/calendar-tools'
import { MonthView, CalendarDay, DayView, CalendarViews } from '../../calendar/common/models'
import { MonthDisplayOptionsComponent } from './month-displayOptions.component';
import { CalendarStore } from '../../../stores/calendar.store';
import { StorageService } from '../../../services/storage.service';
import { ViewChangeRequest } from '../../../events/calendar.events';
import { MonthViewDateComponent } from './month-view-date.component';

@Component({
  selector: 'ac-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss', 
              '../common/calendar-card.scss']
})
export class MonthViewComponent implements OnInit {
  @Output() changeViewDate: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() changeSelectedView: EventEmitter<CalendarViews> = new EventEmitter<CalendarViews>();

  @ViewChild(MonthViewDateComponent) monthViewDate: MonthViewDateComponent;

  private viewDate: Date;

  private header: CalendarDay[];

  public showErrorMessage: boolean;
  public errorMessage: string;

  constructor(
    public calendarStore: CalendarStore,
    private loadingService: TdLoadingService,
    private dialog: MatDialog,
    private storageService: StorageService ) {
  }

  ngOnInit() {   
    this.calendarStore.isMonthLoading.subscribe( result => {
      this.toggleShowLoading(result); 
    });

    this.calendarStore.hasMonthError.subscribe( result => {
        this.showErrorMessage = result;
        this.errorMessage = this.calendarStore.monthErrorMessage;
    });
  }

  public updateViewDate(date: Date) {
    this.monthViewDate.updateViewDate(date);

    this.handleDateChanged(date);
  }

  public onChangeViewDate( date: Date ){
    this.handleDateChanged(date);
    this.changeViewDate.emit(date);
  }

  public onChangeView( event: ViewChangeRequest){
    this.viewDate = event.viewDate;

    this.changeViewDate.emit(event.viewDate);
    this.changeSelectedView.emit(event.view);
  }

  public showDisplayOptions(){
    this.dialog.open(MonthDisplayOptionsComponent);
  }

  private handleDateChanged(date: Date) {
  
    this.viewDate = date;

    this.header = getWeekHeaderDays({viewDate: this.viewDate, excluded: []});

    this.calendarStore.getDataForMonth(this.viewDate);
  } 

  private toggleShowLoading(show:boolean) {
    if (show) {
        this.loadingService.register('showMonthViewLoading');
    } 
    else {
        this.loadingService.resolve('showMonthViewLoading');
    }
  }
}