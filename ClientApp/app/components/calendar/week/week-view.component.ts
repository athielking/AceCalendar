import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Observable } from 'rxjs/Rx';
import * as isSameWeek from 'date-fns/is_same_week'
import * as isSameDay from 'date-fns/is_same_day';
import * as add_weeks from 'date-fns/add_weeks';
import * as start_of_week from 'date-fns/start_of_week';
import * as end_of_week from 'date-fns/end_of_week';

import { CalendarDay, DayView } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'
import { WorkerMovedEvent } from './week-cell.component';
import { WeekCellJobComponent } from './week-cell-job.component';
import { WorkerListAdded } from '../../../events/worker.events';

@Component({
    selector: 'ac-week-view',
    templateUrl: './week-view.component.html',
    styleUrls: ["./week-view.component.scss"]
})
export class WeekViewComponent implements OnInit {
    @Input() viewDate: Date;
    @Input() weekData: DayView[];
    @Output() changeViewDate: EventEmitter<Date> = new EventEmitter();

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

    viewDateForward(): void {
        this.changeViewDate.emit( add_weeks(this.viewDate, 1))
    }

    viewDateBack(): void {
        this.changeViewDate.emit( add_weeks(this.viewDate, -1))
    }

    onWorkerMoved(event: WorkerMovedEvent){
        
        this.weekData.forEach( dv => {
            if( isSameDay(dv.calendarDay.date, event.date)){
                dv.addWorkerToJob(event.worker, event.calendarJob);
                return;
            }
        })

        this.calendarStore.moveWorkerToJob( event.worker, event.date, event.calendarJob ).subscribe( result => 
            this.calendarStore.getDataForWeek(this.viewDate)
        );
    }

    onWorkerAddedAvailable(event: WorkerListAdded){

        this.weekData.forEach( dv => {
            if( isSameDay(dv.calendarDay.date, event.date)){
                dv.makeWorkerAvailable(event.worker)
                return;
            }
        })

        this.calendarStore.moveWorkerToAvailable( event.worker, event.date ).subscribe(result =>
            this.calendarStore.getDataForWeek(this.viewDate) 
        );
    }

    onWorkerAddedOff(event: WorkerListAdded){

        this.weekData.forEach( dv => {
            if( isSameDay(dv.calendarDay.date, event.date)){
                dv.makeWorkerOff(event.worker)
                return;
            }
        })

        this.calendarStore.moveWorkerToOff( event.worker,event.date).subscribe(result =>
            this.calendarStore.getDataForWeek(this.viewDate) 
        );
    }
}