import { Component, Input, Inject } from '@angular/core'
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core'

import { CalendarDay, DayView } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'
import { WorkerListAdded } from '../../../events/worker.events';
import { WorkerAddedToJobEvent } from '../../job/job-list.component';
import { WorkerAddedJobEvent } from '../../calendar/week/week-cell-job.component';

@Component({
    selector: "ac-day-view",
    templateUrl: "./day-view.component.html",
    styleUrls: ["./day-view.component.scss", "../common/calendar-card.scss"]
})
export class DayViewComponent {
    dayView: DayView;

    constructor(private calendarStore: CalendarStore,
                private dialogRef: MatDialogRef<DayViewComponent>,
                private dialogService: TdDialogService,
                @Inject(MAT_DIALOG_DATA) public data: any ){

        this.dayView = data.dayView;
    }

    ngOnInit(){
        // this.calendarStore.calendarData.subscribe( result => {
        //     this._dayView = result.get(this.viewDate);
        // })

        // this.calendarStore.getDataForDay(this.viewDate);
    }

    public onWorkerAddedJob(event: WorkerAddedToJobEvent ){
        this.calendarStore.moveWorkerToJob( event.worker, event.date, event.calendarJob ).subscribe(result => {     
            this.dayView.addWorkerToJob(event.worker, event.calendarJob);            
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Job'
            });
        });
    }

    public onWorkerAddedToJob(event: WorkerAddedJobEvent) {

        this.calendarStore.moveWorkerToJob( event.worker, this.dayView.calendarDay.date, event.calendarJob ).subscribe(result => {     
            this.dayView.addWorkerToJob(event.worker, event.calendarJob);            
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Job'
            });
        });
    }

    public onWorkerAddedAvailable(event: WorkerListAdded){
        this.calendarStore.moveWorkerToAvailable( event.worker, event.date ).subscribe(result => {      
            this.dayView.makeWorkerAvailable(event.worker)                  
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Available'
            });
        });
    }

    public onWorkerAddedOff(event: WorkerListAdded){
        this.calendarStore.moveWorkerToOff( event.worker,event.date).subscribe(result => {      
           this.dayView.makeWorkerOff(event.worker);            
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Time Off'
            });
        });
    }

    public onCancelClick(){
        this.dialogRef.close();
    }

    public onCloseClick(){
        this.dialogRef.close();
    }
}