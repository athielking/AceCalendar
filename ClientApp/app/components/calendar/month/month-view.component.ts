import { Component, Input, Output, OnInit,OnChanges, SimpleChanges, EventEmitter } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Rx';

import { getWeekHeaderDays } from '../../calendar/common/calendar-tools'
import { MonthView, CalendarDay, DayView, CalendarViews } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'
import { ViewChangeRequest } from '../../../events/calendar.events';

import * as add_months from 'date-fns/add_months'
import * as is_same_month from 'date-fns/is_same_month'
import * as end_of_month from 'date-fns/end_of_month'
import * as start_of_month from 'date-fns/start_of_month'
import * as is_this_month from 'date-fns/is_this_month'

@Component({
  selector: 'ac-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss', 
              '../common/calendar-card.scss']
})
export class MonthViewComponent implements OnInit {
  @Output() changeViewDate: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() changeSelectedView: EventEmitter<CalendarViews> = new EventEmitter<CalendarViews>();

  private viewDate: Date;

  private header: CalendarDay[];

  public showErrorMessage: boolean;
  public showAllJobs: boolean = false;
  public errorMessage: string;

  constructor(
    public calendarStore: CalendarStore,
    private loadingService: TdLoadingService) {
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
    this.viewDate = date;

    this.header = getWeekHeaderDays({viewDate: this.viewDate, excluded: []});

    this.calendarStore.getDataForMonth(this.viewDate);
  }

  public viewDateBack(){
    this.handleDateChanged( end_of_month( add_months(this.viewDate, -1) ) );
  }

  public viewDateForward(){
    this.handleDateChanged( start_of_month( add_months(this.viewDate, 1) ) );
  }

  public onChangeView( event: ViewChangeRequest){
    this.viewDate = event.viewDate;

    this.changeViewDate.emit(event.viewDate);
    this.changeSelectedView.emit(event.view);
  }

  private handleDateChanged(date: Date) {

    if(is_this_month(date))
      date= new Date();
      
    this.updateViewDate(date);
    this.changeViewDate.emit(date);
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