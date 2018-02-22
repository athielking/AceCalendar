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
import { WeekCellJobComponent } from './week-cell-job.component';
import { WorkerListAdded } from '../../../events/worker.events';
import { TdDialogService } from '@covalent/core';
import { WorkerAddedToJobEvent } from '../../job/job-list.component';

@Component({
    selector: 'ac-week-view',
    templateUrl: './week-view.component.html',
    styleUrls: ["./week-view.component.scss"]
})
export class WeekViewComponent implements OnInit {
    @Output() changeViewDate: EventEmitter<Date> = new EventEmitter();

    private weekData: DayView[];

    private viewDate: Date;

    public startOfWeek: Date;
    
    public endOfWeek: Date;

    public showErrorMessage: boolean;
    
    public errorMessage: string;

    constructor(
        public calendarStore: CalendarStore,
        private loadingService: TdLoadingService,
        private dialogService: TdDialogService ) {
    }

    public ngOnInit() {
        this.calendarStore.isWeekLoading.subscribe( result => {
            this.toggleShowLoading(result); 
        });

        this.calendarStore.hasWeekError.subscribe( result => {
            this.showErrorMessage = result;
            this.errorMessage = this.calendarStore.weekErrorMessage;
        });

        this.calendarStore.weekData.subscribe( result => {
            this.weekData = result.toArray();     
        });
    }

    public updateViewDate(date: Date) {
        this.viewDate = date;

        this.calendarStore.getDataForWeek(this.viewDate);

        this.startOfWeek = start_of_week(this.viewDate);
        this.endOfWeek = end_of_week(this.viewDate);
    }

    public viewDateForward(): void {
        this.handleDateChanged( add_weeks(this.viewDate, 1))
    }

    public viewDateBack(): void {
        this.handleDateChanged( add_weeks(this.viewDate, -1))
    }

    public onWorkerAddedJob(event: WorkerAddedToJobEvent ){
        this.calendarStore.moveWorkerToJob( event.worker, event.date, event.calendarJob ).subscribe(result => {      
            this.weekData.forEach( dv => {
                if( isSameDay(dv.calendarDay.date, event.date)){
                    dv.addWorkerToJob(event.worker, event.calendarJob);
                    return;
                }
            });           
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Job'
            });
        });
    }

    public onWorkerAddedAvailable(event: WorkerListAdded){
        this.calendarStore.moveWorkerToAvailable( event.worker, event.date ).subscribe(result => {      
            this.weekData.forEach( dv => {
                if( isSameDay(dv.calendarDay.date, event.date)){
                    dv.makeWorkerAvailable(event.worker)
                    return;
                }
            });                   
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Available'
            });
        });
    }

    public onWorkerAddedOff(event: WorkerListAdded){
        this.calendarStore.moveWorkerToOff( event.worker,event.date).subscribe(result => {      
            this.weekData.forEach( dv => {
                if( isSameDay(dv.calendarDay.date, event.date)){
                    dv.makeWorkerOff(event.worker)
                    return;
                }
            });                  
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Time Off'
            });
        });
    }

    private handleDateChanged(date: Date) {
        this.updateViewDate(date);
        this.changeViewDate.emit(date);
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('showWeekViewLoading');
        } 
        else {
            this.loadingService.resolve('showWeekViewLoading');
        }
    }
}