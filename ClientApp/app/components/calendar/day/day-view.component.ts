import { Component, Input, Inject, OnInit, OnDestroy } from '@angular/core'
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core'

import { AddWorkerOption } from '../../../models/shared/calendar-options';
import { CalendarDay, DayView } from '../common/models'
import { CalendarStore } from '../../../stores/calendar.store'
import { WorkerListAdded } from '../../../events/worker.events';
import { WorkerAddedToJobEvent } from '../../job/job-list.component';
import { WorkerAddedJobEvent, EditJobRequestedEvent, DeleteJobDayRequestedEvent } from '../week/week-cell-job.component';
import { AddJobToDayViewComponent } from '../../job/addJobToDayViewComponent';
import { Subscription } from 'rxjs';

@Component({
    selector: "ac-day-view",
    templateUrl: "./day-view.component.html",
    styleUrls: ["./day-view.component.scss", "../common/calendar-card.scss"]
})
export class DayViewComponent implements OnInit, OnDestroy {
    
    private viewDate: Date;
    
    private isDayLoadingSubscription: Subscription;
    private dayDataSubscription: Subscription;
    
    private dataUpdated: Boolean;

    public dayView: DayView;
    
    public showErrorMessage: boolean;
    
    public isLoading: boolean;
    
    public errorMessage: string;

    constructor(
        private calendarStore: CalendarStore,
        private dialogRef: MatDialogRef<DayViewComponent>,
        private dialogService: TdDialogService,
        private dialog: MatDialog,
        private loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any ){

        this.viewDate = data.viewDate;

        this.dayDataSubscription = this.calendarStore.dayData.subscribe( result => {
            this.dayView = result;
        })
        this.calendarStore.getDataForDay(this.viewDate);
    }

    public ngOnInit() {
        this.isDayLoadingSubscription = this.calendarStore.isDayLoading.subscribe( result => {
            this.isLoading = result;
            this.toggleShowLoading(result); 
        });
    }

    public ngOnDestroy() {
        this.isDayLoadingSubscription.unsubscribe();
        this.dayDataSubscription.unsubscribe();
    }

    public onWorkerAddedToJob(event: WorkerAddedJobEvent) {
        this.dataUpdated = true;

        var sub = this.calendarStore.moveWorkerToJob(this.viewDate, event.worker, this.dayView.calendarDay.date, event.calendarJob, AddWorkerOption.SingleDay )
            .subscribe(result => {}, error => {
                this.dialogService.openAlert({
                    message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                    title: 'Failed to Add Worker to Job'
                });
            }, () => sub.unsubscribe() );
    }

    public onWorkerAddedAvailable(event: WorkerListAdded){
        this.dataUpdated = true;
        
        var sub = this.calendarStore.moveWorkerToAvailable( event.worker, event.date )
            .subscribe(result => {}, error => {
                this.dialogService.openAlert({
                    message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                    title: 'Unable to Add Worker to Available'
                });
            }, () => sub.unsubscribe() );
    }

    public onWorkerAddedOff(event: WorkerListAdded){
        this.dataUpdated = true;
        
        var sub = this.calendarStore.moveWorkerToOff( event.worker,event.date)
            .subscribe(result => {}, error => {
                this.dialogService.openAlert({
                    message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                    title: 'Unable to Add Worker to Time Off'
                });
            }, () => sub.unsubscribe() );
    }

    public onCloseClick(){
        this.dialogRef.close( this.dataUpdated );
    }

    public showAddJob() {
        this.dataUpdated = true;

        let dialogRef = this.dialog.open(AddJobToDayViewComponent, {
            disableClose: true,
            data: {
                isEdit: false,
                editJobId: '',
                jobNumber: '',
                jobName: '',
                notes: '',
                startDate: this.dayView.calendarDay.date,
                endDate: null       
            }
        });
    }

    public onDeleteJobRequested(event: DeleteJobDayRequestedEvent ) {
        this.dataUpdated = true;
        
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this Job?',
            title: 'Confirm Delete'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
               
                var sub = this.calendarStore.deleteJob(event.jobId, event.date)
                    .subscribe(result => {}, error => {
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete Job'
                        });
                    }, () => sub.unsubscribe());
            }
        });
    }
    
    public onEditJobRequested(event: EditJobRequestedEvent) {
        this.dataUpdated = true;

        this.calendarStore.getJobDays( event.job.id).subscribe(result => { 
            let dialogRef = this.dialog.open(AddJobToDayViewComponent, {
                disableClose: true,
                data: {
                    isEdit: true,
                    editJobId: event.job.id,
                    jobNumber: event.job.number,
                    jobName: event.job.name,
                    notes: event.job.notes,
                    jobDays: result,
                    selectedTags: event.job.tags     
                }
            });
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Get Job Start and End Date'
            });
        });
    }
    
    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('showDayViewLoading');
        } 
        else {
            this.loadingService.resolve('showDayViewLoading');
        }
      }
}