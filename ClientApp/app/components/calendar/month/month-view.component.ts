import { Component, Input, Output, OnInit,OnChanges, SimpleChanges, EventEmitter } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Rx';

import { getWeekHeaderDays } from '../../calendar/common/calendar-tools'
import { MonthView, CalendarDay, DayView } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'
import * as add_months from 'date-fns/add_months'
import * as is_same_month from 'date-fns/is_same_month'




@Component({
  selector: 'ac-month-view',
  templateUrl: './month-view.component.html'
})
export class MonthViewComponent implements OnInit {
  @Input() viewDate: Date;
  @Output() changeViewDate: EventEmitter<Date> = new EventEmitter<Date>();

  private header: CalendarDay[];
  private dayViews: Observable<DayView>[];
  private dayMap: Map<Date, Observable<DayView>>;
  public dataLoading: boolean;

  constructor(public calendarStore: CalendarStore) {
  }

  ngOnInit() {
    this.header = getWeekHeaderDays({viewDate: this.viewDate, excluded: []});
    this.calendarStore.getDataForMonth(this.viewDate);
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.viewDate && !changes.viewDate.firstChange)
    {
      if( !is_same_month(changes.viewDate.currentValue, changes.viewDate.previousValue ))
        this.calendarStore.getDataForMonth(this.viewDate);
    }
  }

  public viewDateBack(){
    this.changeViewDate.emit( add_months(this.viewDate, -1) );
  }

  public viewDateForward(){
    this.changeViewDate.emit( add_months(this.viewDate, 1) );
  }
}