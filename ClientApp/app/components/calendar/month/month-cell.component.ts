import { Component, Input } from '@angular/core'
import { getMonthView } from '../../calendar/common/calendar-tools'
import { CalendarDay } from '../../calendar/common/models'

@Component({
    selector: 'month-cell',
    template: `
        <div class="month-cell"
            [class.cal-today]="monthDay.isToday"
            [class.cal-weekend]="monthDay.isWeekend"
            [class.cal-in-month]="monthDay.inMonth"
            [class.cal-out-month]="!monthDay.inMonth">
            <div class="month-cell-top">
                <span class="cell-badge" *ngIf="monthDay.jobs && monthDay.jobs.length() > 0">{{monthDay.jobs.length()}}</span>
                <span class="cell-day-number"
                    [class.cal-weekend]="monthDay.isWeekend">
                    {{monthDay.date | date:'d'}}
                </span>
            </div>
            <div class="month-cell-content">
            </div>
        </div>
    `,
  })
  export class MonthCellComponent {
    @Input() monthDay : CalendarDay;
  }