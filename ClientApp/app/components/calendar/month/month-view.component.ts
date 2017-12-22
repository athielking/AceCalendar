import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { getMonthView } from '../../calendar/common/calendar-tools'
import { MonthView } from '../../calendar/common/models'

@Component({
    selector: 'ac-month-view',
    templateUrl: './month-view.component.html'
  })
  export class MonthViewComponent implements OnInit {
    @Input() viewDate : Date;

    monthView: MonthView;

    ngOnInit(){
        this.monthView = getMonthView({viewDate: this.viewDate, excluded: []});
    }
  }