import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { getMonthView } from '../../calendar/common/calendar-tools'
import { environment } from '../../../../environments/environment';
import { MonthView } from '../../calendar/common/models'
import { JobService } from '../../../services/job.service'
import {CalendarJob } from '../common/models'
import {Http} from '@angular/http';
@Component({
    selector: 'ac-month-view',
    templateUrl: './month-view.component.html'
  })
  export class MonthViewComponent implements OnInit {
    @Input() viewDate : Date;

    monthView: MonthView;

    constructor(private http: Http){
    }

    ngOnInit(){
        this.monthView = getMonthView({viewDate: this.viewDate, excluded: []});
    }
  }