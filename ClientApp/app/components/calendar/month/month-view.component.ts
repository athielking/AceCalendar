import { Component, Input, OnInit } from '@angular/core'
import { TdLoadingService } from '@covalent/core'

import { getWeekHeaderDays } from '../../calendar/common/calendar-tools'
import { MonthView, CalendarDay } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'

@Component({
    selector: 'ac-month-view',
    templateUrl: './month-view.component.html'
  })
  export class MonthViewComponent implements OnInit {
    @Input() viewDate : Date;

    dataLoading: boolean = false;
    header: CalendarDay[];

    constructor(private calendarStore: CalendarStore,
                private loadingService: TdLoadingService){
    }

    ngOnInit(){
      
      this.header = getWeekHeaderDays({viewDate: this.viewDate, excluded: []});
      this.loadingService.register('dataLoading');

      this.calendarStore.calendarData.subscribe(result => {
        this.loadingService.resolve('dataLoading');
      })

      this.calendarStore.getDataForMonth(this.viewDate);
    }
  }