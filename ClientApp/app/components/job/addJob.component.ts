import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {TdDialogService,TdLoadingService} from '@covalent/core';

import { AddJobModel } from '../calendar/common/models';
import { JobStore } from '../../stores/job.store';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'ac-addJob',
    templateUrl: './addJob.component.html'
})
export abstract class AddJobComponent {
    
    private isEdit: boolean;
    private editJobId: string;

    public jobNumber: string;
    public jobName: string;
    public notes: string;
    public startDate: Date;
    public endDate: Date;

    constructor(
        private dialogRef: MatDialogRef<AddJobComponent>,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){ 
        this.isEdit = data.isEdit,
        this.editJobId = data.editJobId,
        this.jobNumber = data.jobNumber,
        this.jobName = data.jobName,
        this.notes = data.notes,
        this.startDate = data.startDate,
        this.endDate = data.endDate        
    }

    public onCancelClick() {
        this.dialogRef.close();
    }

    public onOkClick() {
        if(this.isEdit)
            this.editJob();
    
        else
            this.addJob();      
    }

    public endDateIsNotBeforeStartDate() {
        return this.endDate == null || this.startDate <= this.endDate;
    }

    private addJob() {
        this.toggleShowLoading(true);

        var addJobModel = new AddJobModel(
            this.jobNumber, 
            this.jobName, 
            this.notes, 
            this.startDate,
            this.endDate
        );

        this.AddJobThroughStore(addJobModel).subscribe( result => {
            this.dialogRef.close();
            this.toggleShowLoading(false);
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Job'
            });
        } ); 
    }

    private editJob() {
        this.toggleShowLoading(true);
        
        var addJobModel = new AddJobModel(
            this.jobNumber, 
            this.jobName, 
            this.notes, 
            this.startDate,
            this.endDate
        );

        this.EditJobThroughStore(this.editJobId, addJobModel).subscribe( result => {
            this.dialogRef.close();
            this.toggleShowLoading(false);
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Update Job'
            });
        } ); 
    }
    
    protected abstract AddJobThroughStore(addJobModel: AddJobModel) : Observable<object>;

    protected abstract EditJobThroughStore(editJobId: string, addJobModel: AddJobModel) : Observable<object>;
    
    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('addJobShowLoading');
        } 
        else {
            this.loadingService.resolve('addJobShowLoading');
        }
    }
}