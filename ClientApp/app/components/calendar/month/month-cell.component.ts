import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core'
import { getMonthView } from '../../calendar/common/calendar-tools'
import { CalendarDay, CalendarJob } from '../../calendar/common/models'
import { JobStore } from '../../../stores/job.store';

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
                <span *ngFor="let job of jobStore.jobs | async" class="month-cell-job">{{job.jobNumber}} {{job.title}}</span>
            </div>
        </div>
    `,
    providers: [JobStore]
  })
  export class MonthCellComponent 
    implements OnInit {
        @Input() monthDay : CalendarDay;

        constructor(
            private jobStore: JobStore,
            private cdr: ChangeDetectorRef
        ) {
        }

        ngOnInit(){
            this.jobStore.initialize(this.monthDay.date);
        }
    }