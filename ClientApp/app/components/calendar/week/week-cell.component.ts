import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import * as dateFns from 'date-fns';

import { DayView } from '../../calendar/common/models'
import * as dateTools from '../../../tools/dateTools';

@Component({
    selector: 'ac-week-cell',
    templateUrl: './week-cell.component.html',
    styleUrls: ['../common/calendar-card.scss']
})
export class WeekCellComponent implements OnInit {
    @Input() dayView: DayView;
    @Output() copyDayRequested: EventEmitter<CopyDayRequest> = new EventEmitter();

    public otherDays: Date[];

    ngOnInit(){
        this.otherDays = [];
        
        let sunday = dateFns.startOfWeek(this.dayView.calendarDay.date);
        let saturday = dateFns.endOfWeek(this.dayView.calendarDay.date);

        for( let i:number=0; dateFns.addDays(sunday, i) <= saturday; i++)
        {
            let weekDay = dateFns.addDays(sunday, i);
            if( dateTools.datesAreEqual(weekDay, this.dayView.calendarDay.date))
                continue;
            
            this.otherDays.push(weekDay);
        }
    }

    public copyToDay(date: Date){
        this.copyDayRequested.emit({dayFrom: this.dayView.calendarDay.date, dayTo: date});
    }
}

export interface CopyDayRequest{
    dayFrom: Date;
    dayTo: Date;
}