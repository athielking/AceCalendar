import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core'
import { getMonthView } from '../../calendar/common/calendar-tools'
import { CalendarDay, CalendarJob } from '../../calendar/common/models'
import { CalendarService } from '../../../providers/calendar-service.provider';

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
                <span *ngFor="let job of jobs" class="month-cell-job">{{job.jobNumber}} {{job.title}}</span>
            </div>
        </div>
    `,
  })
  export class MonthCellComponent 
    implements OnInit {
        @Input() monthDay : CalendarDay;

        jobs : CalendarJob[];

        constructor(
            private calendarService: CalendarService,
            private cdr: ChangeDetectorRef
        ) {
        }

        ngOnInit(){
            this.calendarService.getJobs().then( _ => {
                this.jobs = this.calendarService.jobs
                    .filter(job => job.date === this.monthDay.date);
                
                this.cdr.markForCheck();
            });
        }
    }