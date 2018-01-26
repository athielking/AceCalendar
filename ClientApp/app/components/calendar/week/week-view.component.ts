import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Rx';
import * as isSameWeek from 'date-fns/is_same_week'
import * as add_weeks from 'date-fns/add_weeks';
import * as start_of_week from 'date-fns/start_of_week';
import * as end_of_week from 'date-fns/end_of_week';

import { CalendarDay, DayView } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'
import { WorkerMovedEvent } from './week-cell.component';



@Component({
    selector: 'ac-week-view',
    templateUrl: './week-view.component.html'
})
export class WeekViewComponent implements OnInit {
    @Input() viewDate: Date;
    @Output() changeViewDate: EventEmitter<Date> = new EventEmitter();

    private dayViews: Observable<DayView>[];
    private dayMap: Map<Date, Observable<DayView>>;
    public dataLoading: boolean;
    public startOfWeek: Date;
    public endOfWeek: Date;

    constructor(public calendarStore: CalendarStore) {
    }

    ngOnInit() {
        this.calendarStore.getDataForWeek(this.viewDate);

        this.startOfWeek = start_of_week(this.viewDate);
        this.endOfWeek = end_of_week(this.viewDate);
    }
    ngOnChanges(changes: SimpleChanges){
        if(changes.viewDate && !changes.viewDate.firstChange)
        {
            this.calendarStore.getDataForWeek(this.viewDate);

            this.startOfWeek = start_of_week(this.viewDate);
            this.endOfWeek = end_of_week(this.viewDate);
        }
    }

    viewDateForward(){
        this.changeViewDate.emit( add_weeks(this.viewDate, 1))
    }

    viewDateBack(){
        this.changeViewDate.emit( add_weeks(this.viewDate, -1))
    }

    onWorkerMoved(event: WorkerMovedEvent){
        
        console.log(event);
        this.calendarStore.moveWorker( event.worker, event.calendarJob, event.date ).subscribe( result => 
            this.calendarStore.getDataForWeek(this.viewDate)
        );
    }
}