import { Component, Output, EventEmitter } from '@angular/core'

import * as add_months from 'date-fns/add_months'
import * as end_of_month from 'date-fns/end_of_month'
import * as start_of_month from 'date-fns/start_of_month'
import * as is_this_month from 'date-fns/is_this_month'

@Component({
    selector: 'ac-month-view-date',
    templateUrl: './month-view-date.component.html',
    styleUrls: ['./month-view-date.component.scss']
  })
  export class MonthViewDateComponent {
    @Output() changeViewDate: EventEmitter<Date> = new EventEmitter<Date>();
  
    private viewDate: Date;

    constructor() {
    }
  
    public updateViewDate(date: Date) {
      this.viewDate = date;
    }
  
    public viewDateBack(){
      this.handleDateChanged( end_of_month( add_months(this.viewDate, -1) ) );
    }
  
    public viewDateForward(){
      this.handleDateChanged( start_of_month( add_months(this.viewDate, 1) ) );
    }
  
    private handleDateChanged(date: Date) {
  
      if(is_this_month(date))
        date = new Date();
        
      this.updateViewDate(date);
      this.changeViewDate.emit(date);
    }  
}