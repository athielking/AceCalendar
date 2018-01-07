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
    @Input() viewDate : Date;

    header: CalendarDay[];
    monthView : Observable<DayView>[];
    monthMap: Map<Date, Observable<DayView>>;

    constructor(private calendarStore: CalendarStore,
                private loadingService: TdLoadingService){
    }

    ngOnInit(){
      
      this.header = getWeekHeaderDays({viewDate: this.viewDate, excluded: []});
      this.loadingService.register('dataLoading');

      this.calendarStore.calendarData.subscribe(result => {
        this.monthMap = result;
        this.monthView = Array.from( result.values() );

        this.loadingService.resolve('dataLoading');
      })

      this.calendarStore.getDataForMonth(this.viewDate);
    }
  }