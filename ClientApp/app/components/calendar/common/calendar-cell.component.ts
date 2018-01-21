import { Component, Input, Output, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Rx';

import { DayView, CalendarDay, CalendarJob, Worker } from '../../calendar/common/models'

@Component({
    selector: 'ac-cell',
  })
  export class CalendarCellComponent implements OnInit {
        @Input() dayView : DayView;

        calendarDay: CalendarDay;
        jobs: CalendarJob[] = [];
        workers: Worker[] = [];

        ngOnInit(){
            // this.dayView$.subscribe( result => setTimeout( () => {
            //     this.calendarDay = result.calendarDay;
            //     this.jobs = result.jobs;
            //     this.workers = result.availableWorkers;
            // }));
        }
    }