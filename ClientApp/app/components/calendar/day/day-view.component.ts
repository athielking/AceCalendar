import { Component, Input, OnInit } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Rx';

import { CalendarDay, DayView } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'

@Component({
    selector: "ac-day-view",
    templateUrl: "./day-view.component.html"
})
export class DayViewComponent implements OnInit{
    @Input() viewDate: Date;

    private _dayView: Observable<DayView>;
    constructor( private calendarStore: CalendarStore ){
    }

    ngOnInit(){
        // this.calendarStore.calendarData.subscribe( result => {
        //     this._dayView = result.get(this.viewDate);
        // })

        // this.calendarStore.getDataForDay(this.viewDate);
    }
}