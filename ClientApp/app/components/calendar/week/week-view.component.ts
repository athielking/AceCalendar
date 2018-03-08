import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core'
import { TdLoadingService, TdDialogService } from '@covalent/core'
import {MatSelectChange} from '@angular/material';
import { Observable } from 'rxjs/Rx';
import * as isSameWeek from 'date-fns/is_same_week'
import * as isSameDay from 'date-fns/is_same_day';
import * as add_weeks from 'date-fns/add_weeks';
import * as start_of_week from 'date-fns/start_of_week';
import * as end_of_week from 'date-fns/end_of_week';

import { AddWorkerOption } from '../../../models/shared/calendar-options';
import { CalendarDay, DayView } from '../../calendar/common/models'
import { CalendarStore } from '../../../stores/calendar.store'
import { StorageService} from '../../../services/storage.service';
import { WeekCellJobComponent, DeleteJobRequestedEvent, EditJobRequestedEvent } from './week-cell-job.component';
import { WorkerListAdded } from '../../../events/worker.events';
import { WorkerAddedToJobEvent } from '../../job/job-list.component';
import { MatDialog } from '@angular/material';
import { AddJobToWeekViewComponent } from '../../job/addJobToWeekViewComponent';
import { StorageKeys } from '../common/calendar-tools';

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

    public workerAddOption: AddWorkerOption = AddWorkerOption.SingleDay;

    constructor(
        public calendarStore: CalendarStore,
        private storageService: StorageService,
        private loadingService: TdLoadingService,
        private dialogService: TdDialogService,
        private dialog: MatDialog ) {
    }

    public addWorkerOptionCompare(o1, o2): boolean{
        return (<AddWorkerOption>o1) == (<AddWorkerOption>o2);
    }

    public addWorkerOptionChange(e: MatSelectChange){
        this.storageService.setItem(StorageKeys.addWorkerOption, e.value);
    }

    public ngOnInit() {

        if(this.storageService.hasItem(StorageKeys.addWorkerOption))
            this.workerAddOption= +this.storageService.getItem(StorageKeys.addWorkerOption);

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

    public onDeleteJobRequested(event: DeleteJobRequestedEvent ) {
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this Job?',
            title: 'Confirm Delete'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);

                this.calendarStore.deleteJob(event.jobId)
                    .subscribe(result => {
                        this.toggleShowLoading(false);                        
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete Job'
                        });
                    });
            }
        });
    }
    
    public onEditJobRequested(event: EditJobRequestedEvent) {
        this.calendarStore.getJobStartAndEndDate( event.job.id).subscribe(result => { 
            let dialogRef = this.dialog.open(AddJobToWeekViewComponent, {
                disableClose: true,
                data: {
                    isEdit: true,
                    editJobId: event.job.id,
                    jobNumber: event.job.number,
                    jobName: event.job.name,
                    notes: event.job.notes,
                    startDate: result.startDate,
                    endDate: result.endDate       
                }
            });
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Get Job Start and End Date'
            });
        });
    }
    
    public onWorkerAddedJob(event: WorkerAddedToJobEvent ){

        if(this.workerAddOption != AddWorkerOption.SingleDay)
            this.toggleShowLoading(true);

        this.calendarStore.moveWorkerToJob( event.worker, event.date, event.calendarJob, this.workerAddOption ).subscribe(result => {      
            this.weekData.forEach( dv => {
                if( isSameDay(dv.calendarDay.date, event.date)){
                    dv.addWorkerToJob(event.worker, event.calendarJob);
                    return;
                }

                this.toggleShowLoading(false);
            });           
        }, error => {
            this.toggleShowLoading(false);
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

    protected toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('showWeekViewLoading');
        } 
        else {
            this.loadingService.resolve('showWeekViewLoading');
        }
    }
}