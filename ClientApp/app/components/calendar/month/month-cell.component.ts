import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core'
import { getMonthView } from '../../calendar/common/calendar-tools'
import { CalendarDay, CalendarJob } from '../../calendar/common/models'
import { JobStore } from '../../../stores/job.store';

@Component({
    selector: 'ac-month-cell',
    templateUrl: './month-cell.component.html',
    //styleUrls: ['./month-cell.component.css'],
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