import { Component, Input, OnInit } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Rx';
import * as isSameWeek from 'date-fns/is_same_week'

import { CalendarDay, DayView } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'
import { WorkerMovedEvent } from './week-cell.component';


@Component({
    selector: 'ac-week-view',
    templateUrl: './week-view.component.html'
})
export class WeekViewComponent implements OnInit {
    @Input() viewDate: Date;

    private dayViews: Observable<DayView>[];
    private dayMap: Map<Date, Observable<DayView>>;

    constructor(private calendarStore: CalendarStore) {
    }

    ngOnInit() {
        // this.calendarStore.weekData.subscribe(result => {
        //     this.dayMap = result;
        //     this.dayViews = Array.from(result.values());
        // });

        this.calendarStore.getDataForWeek(this.viewDate);
    }

    onWorkerMoved(event: WorkerMovedEvent){
        
        console.log(event);
        this.calendarStore.moveWorker( event.worker, event.calendarJob, event.date ).subscribe( result => 
            this.calendarStore.getDataForWeek(this.viewDate)
        );
    }
}