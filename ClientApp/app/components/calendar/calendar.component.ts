import { Component } from '@angular/core'
import { getMonthView } from '../calendar/common/calendar-tools'
import { MonthView } from '../calendar/common/models'

@Component({
    selector: 'calendar',
    template: `
        <div class="calendar-wrapper">
            <div class="calendar-header">
                {{viewDate | date: 'MMMM'}}
            </div>
            
            <div class="week-header" *ngFor="let header of monthView.header">
                {{header.date | date:'EEEE'}}
            </div>
            
            <div class="month-content" *ngFor="let day of monthView.daysOfMonth">
                {{day.date | date: 'd'}}
            </div>
        </div>
    `
  })
  export class CalendarComponent {
    viewDate : Date = new Date();

    monthView: MonthView = getMonthView({viewDate: this.viewDate, excluded: []});
  }