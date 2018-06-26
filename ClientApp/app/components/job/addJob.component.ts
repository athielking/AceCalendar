import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {TdDialogService,TdLoadingService} from '@covalent/core';

import { AddJobModel } from '../calendar/common/models';
import { JobStore } from '../../stores/job.store';
import { Observable } from 'rxjs/Rx';
import { SelectTagComponent } from '../tag/select-tag.component';
import { Tag } from '../../models/tag/tag.model';
import { ChangeViewDateEvent } from '../calendar/common/multi-datepicker.component';
import { SelectJobTagComponent } from '../tag/selectJobTag.component';

@Component({
    selector: 'ac-addJob',
    templateUrl: './addJob.component.html'
})
export abstract class AddJobComponent {
    
    private isEdit: boolean;
    private editJobId: string;

    public viewDate: Date;
    public jobDays: Date[];

    public selectedTags: Tag[];
    public jobDayTags: Tag[];

    public jobNumber: string;
    public jobName: string;
    public notes: string;
    public startDate: Date;
    public endDate: Date;

    constructor(
        private dialog: MatDialog,
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
        this.jobDays = data.jobDays ? data.jobDays : [],
        this.selectedTags = data.selectedTags ? data.selectedTags.filter( value => !value.fromJobDay) : [];
        this.jobDayTags = data.selectedTags ? data.selectedTags.filter( value => value.fromJobDay) : [];        
        this.viewDate = data.viewDate ? data.viewDate : new Date();
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

    public onChangeViewDateRequested(event: ChangeViewDateEvent){
        this.viewDate = event.newDate;
    }

    public jobDaySelected() {
        return this.jobDays.length > 0;
    }

    public selectTags(){

        var selectTagsRef = this.dialog.open(SelectJobTagComponent, {
            data: {
                selected: this.selectedTags
            }
        });

        selectTagsRef.afterClosed().subscribe( result => {
            if(result)
                this.selectedTags = selectTagsRef.componentInstance.selected;
        });
    }

    private addJob() {

        var addJobModel = new AddJobModel(
            this.jobNumber, 
            this.jobName, 
            this.notes, 
            this.selectedTags,
            this.jobDays
        );

        var sub = this.AddJobThroughStore(addJobModel).subscribe( result => {},
            error => {
                this.dialogService.openAlert({
                    message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                    title: 'Failed to Add Job'
                });
            }, () => sub.unsubscribe() ); 

        this.dialogRef.close();
    }

    private editJob() {
        
        var addJobModel = new AddJobModel(
            this.jobNumber, 
            this.jobName, 
            this.notes, 
            this.selectedTags,
            this.jobDays
        );

        var sub = this.EditJobThroughStore(this.editJobId, addJobModel).subscribe( result => {}, 
            error => {
                this.dialogService.openAlert({
                    message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                    title: 'Failed to Update Job'
                });
        }, () => sub.unsubscribe() ); 
        this.dialogRef.close();
    }
    
    protected abstract AddJobThroughStore(addJobModel: AddJobModel) : Observable<object>;

    protected abstract EditJobThroughStore(editJobId: string, addJobModel: AddJobModel) : Observable<object>;
}