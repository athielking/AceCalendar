import { Component, Input, Output, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Rx';

import { DayView, CalendarDay, CalendarJob, Worker } from '../../calendar/common/models'
import { CalendarCellComponent } from '../common/calendar-cell.component';

@Component({
    selector: 'ac-month-cell',
    templateUrl: './month-cell.component.html'
  })
  export class MonthCellComponent extends CalendarCellComponent {
  }