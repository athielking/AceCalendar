import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core'
import { DatePipe } from '@angular/common'

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
import { WeekCellJobComponent, DeleteJobDayRequestedEvent, EditJobRequestedEvent, DayJobTagRequestedEvent } from './week-cell-job.component';
import { WorkerListAdded } from '../../../events/worker.events';
import { WorkerAddedToJobEvent } from '../../job/job-list.component';
import { MatDialog } from '@angular/material';
import { AddJobToWeekViewComponent } from '../../job/addJobToWeekViewComponent';
import { StorageKeys } from '../common/calendar-tools';
import { SelectTagComponent } from '../../tag/select-tag.component';
import { JobStore } from '../../../stores/job.store';
import { CopyDayRequest } from './week-cell.component';
import { WeekViewPrintComponent } from './print/week-view-print.component';

@Component({
    selector: 'ac-week-view',
    templateUrl: './week-view.component.html',
    styleUrls: ["./week-view.component.scss"],
    providers: [DatePipe]
})
export class WeekViewComponent implements OnInit, OnChanges {
    @Input() viewDate: Date;
    @Output() changeViewDate: EventEmitter<Date> = new EventEmitter();

    public isLoading = false;
    protected weekData: DayView[];
    
    public startOfWeek: Date;
    
    public endOfWeek: Date;

    public showErrorMessage: boolean;
    
    public errorMessage: string;

    public workerAddOption: AddWorkerOption = AddWorkerOption.SingleDay;

    constructor(
        public calendarStore: CalendarStore,
        public jobStore: JobStore,
        private storageService: StorageService,
        protected loadingService: TdLoadingService,
        protected dialogService: TdDialogService,
        protected dialog: MatDialog,
        private datePipe: DatePipe) {

            if(this.storageService.hasItem(StorageKeys.addWorkerOption))
                this.workerAddOption= +this.storageService.getItem(StorageKeys.addWorkerOption);    
    }

    public addWorkerOptionCompare(o1, o2): boolean{
        return (<AddWorkerOption>o1) == (<AddWorkerOption>o2);
    }

    public addWorkerOptionChange(e: MatSelectChange){
        this.storageService.setItem(StorageKeys.addWorkerOption, e.value);
    }

    public ngOnInit() {

        this.startOfWeek = start_of_week(this.viewDate);
        this.endOfWeek = end_of_week(this.viewDate);

        this.calendarStore.isWeekLoading.subscribe( result => {
            this.isLoading = result;
        });

        this.calendarStore.weekData.subscribe( result => {
            this.weekData = result;     
        });
    }

    public ngOnChanges( changes: SimpleChanges ){
        if( changes.viewDate )
        {
            this.startOfWeek = start_of_week(this.viewDate);
            this.endOfWeek = end_of_week(this.viewDate);
        }
    }

    public viewDateForward(): void {
        this.handleDateChanged( add_weeks(this.viewDate, 1))
    }

    public viewDateBack(): void {
        this.handleDateChanged( add_weeks(this.viewDate, -1))
    }

    public print(){
        let printContents = document.getElementById("print-section").innerHTML;
        let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`<html>
            <head>
              <title>Print tab</title>
              <style>
                h3 {
                    margin-bottom:0px;
                    margin-top:0px;
                }
                h4 {
                    margin-bottom: 0px;
                    margin-top: 0px;
                }
                .print-grid{
                    display: grid;
                    margin: 8px;
                    grid-template-columns: repeat(7, 1fr);
                    grid-template-rows: auto;
                    grid-auto-rows: 1fr;
                    grid-gap: 4px;
                }
                .column {
                    display: flex;
                    flex-direction: column;
                }
              </style>
            </head>
            <body onload="window.print(); window.close();" >${printContents}</body>
          </html>`);
        
        popupWin.document.close();
    }

    public onDeleteJobRequested(event: DeleteJobDayRequestedEvent ) {
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this Job?',
            title: 'Confirm Delete'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.isLoading = true;
                let sub = this.calendarStore.deleteJob(event.jobId, event.date)
                    .subscribe(result => {                     
                    }, error => {
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete Job'
                        });
                    }, () => {
                        this.isLoading = false;
                        sub.unsubscribe();
                    });
            }
        });
    }
    
    public onEditJobRequested(event: EditJobRequestedEvent) {
        this.calendarStore.getJobDays( event.job.id).subscribe(result => { 
            let dialogRef = this.dialog.open(AddJobToWeekViewComponent, {
                disableClose: true,
                data: {
                    isEdit: true,
                    editJobId: event.job.id,
                    jobNumber: event.job.number,
                    jobName: event.job.name,
                    notes: event.job.notes,
                    jobDays: result,
                    selectedTags: event.job.jobTags     
                }
            });
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Get Job Start and End Date'
            });
        });
    }
    
    public onCopyDayRequested(event: CopyDayRequest){
        this.dialogService.openConfirm({
            message: `Are you sure you wish to copy all jobs and workers from ${this.datePipe.transform(event.dayFrom, 'EEEE')} to ${this.datePipe.transform(event.dayTo, 'EEEE')}`
        }).afterClosed().subscribe((accept: boolean) => {
            if(!accept)
                return;

            this.calendarStore.copyCalendarDay(this.viewDate, event.dayFrom, event.dayTo);
        })
    }

    public onDeleteJobsFromDayRequested(event: Date){
        this.dialogService.openConfirm({
            message: `Are you sure you wish to remove all jobs and workers from ${this.datePipe.transform(event, 'EEEE, mmmm dd')}?`
        }).afterClosed().subscribe((accept: boolean) => {
            if(!accept)
                return;

            this.calendarStore.deleteJobsFromDay(event);
        })
    }

    public onWorkerAddedJob(event: WorkerAddedToJobEvent ){

        if(this.workerAddOption != AddWorkerOption.SingleDay)
            this.isLoading = true;

        var sub = this.calendarStore.moveWorkerToJob( this.viewDate, event.worker, event.date, event.calendarJob, this.workerAddOption )
            .subscribe( result => {}, error => {
                this.dialogService.openAlert({
                    message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                    title: 'Unable to Add Worker to Job'
                });
        }, () => {
            this.isLoading = false;
            sub.unsubscribe();
        });
    }

    public onWorkerAddedAvailable(event: WorkerListAdded){
        this.calendarStore.moveWorkerToAvailable( event.worker, event.date ).subscribe(result => {                        
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Available'
            });
        });
    }

    public onWorkerAddedOff(event: WorkerListAdded){
        this.calendarStore.moveWorkerToOff( event.worker,event.date).subscribe(result => {               
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker to Time Off'
            });
        });
    }

    public onDayJobTagRequested( event: DayJobTagRequestedEvent ){

        var jobTags = event.job.jobTags.filter( value => {
            return !value.fromJobDay
        });

        var jobDayTags = event.job.jobTags.filter( value => {
            return value.fromJobDay
        });

        var dialogRef = this.dialog.open(SelectTagComponent, {
            data: {
                selected: jobDayTags,
                excluded: jobTags
            }
        });
        
        dialogRef.afterClosed().subscribe( result => {
            if(!result)
                return;
            
            this.isLoading = true;
            this.calendarStore.saveTagsForJobDay( event.job.id, dialogRef.componentInstance.selected, event.date )
            this.isLoading = false;
        });
    }

    private handleDateChanged(date: Date) {
        this.changeViewDate.emit(date);
        this.calendarStore.getDataForWeek(date);
    }
}