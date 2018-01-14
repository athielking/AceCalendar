import { Component, Input, Output, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Rx';

import { DayView, CalendarDay, CalendarJob, Worker } from '../../calendar/common/models'

@Component({
    selector: 'ac-month-cell',
    templateUrl: './month-cell.component.html'
  })
  export class MonthCellComponent implements OnInit {
        @Input() dayView$ : Observable<DayView>;

        calendarDay: CalendarDay;
        jobs: CalendarJob[] = [];
        workers: Worker[] = [];

        ngOnInit(){
            this.dayView$.subscribe( result => setTimeout( () => {
                this.calendarDay = result.calendarDay;
                this.jobs = result.jobs;
                this.workers = result.availableWorkers;
            }));
        }
    }