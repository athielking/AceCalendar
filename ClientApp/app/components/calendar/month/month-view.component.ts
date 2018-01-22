import { Component, Input, OnInit } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Rx';

import { getWeekHeaderDays } from '../../calendar/common/calendar-tools'
import { MonthView, CalendarDay, DayView } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'

@Component({
  selector: 'ac-month-view',
  templateUrl: './month-view.component.html'
})
export class MonthViewComponent implements OnInit {
  @Input() viewDate: Date;

  private header: CalendarDay[];
  private dayViews: Observable<DayView>[];
  private dayMap: Map<Date, Observable<DayView>>;

  constructor(private calendarStore: CalendarStore) {
  }

  ngOnInit() {
    this.header = getWeekHeaderDays({viewDate: this.viewDate, excluded: []});

    // this.calendarStore.monthData.subscribe(result => {
    //   this.dayMap = result;
    //   this.dayViews = Array.from(result.values());
    // })

    this.calendarStore.getDataForMonth(this.viewDate);
  }
}