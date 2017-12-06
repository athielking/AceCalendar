import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { getMonthView } from '../../calendar/common/calendar-tools'
import { MonthView } from '../../calendar/common/models'

@Component({
    selector: 'month-view',
    template: `
        <div class="calendar-wrapper">
            <div class="calendar-header">
                {{viewDate | date: 'MMMM'}}
            </div>
            
            <div class="week-header" *ngFor="let header of monthView.header">
                {{header.date | date:'EEEE'}}
            </div>
            
            <month-cell *ngFor="let day of monthView.daysOfMonth"
                [monthDay]="day"
            >
            </month-cell>
        </div>
    `
  })
  export class MonthViewComponent
    implements OnInit, OnChanges {
    viewDate : Date = new Date();

    monthView: MonthView = getMonthView({viewDate: this.viewDate, excluded: []});

    ngOnInit() : void {

    }

    ngOnChanges(changes: any): void {
        
    }
  }