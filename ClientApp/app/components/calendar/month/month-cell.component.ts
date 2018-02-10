import { Component, Input, Output, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Rx';

import { DayView, CalendarDay, CalendarJob, Worker } from '../../calendar/common/models'

@Component({
    selector: 'ac-month-cell',
    templateUrl: './month-cell.component.html'
  })
  export class MonthCellComponent {
    @Input() dayView: DayView;
  }