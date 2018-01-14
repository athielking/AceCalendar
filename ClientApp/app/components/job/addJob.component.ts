import {Component, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ITdDataTableColumn} from '@covalent/core';

import { Worker, AddJobModel } from '../calendar/common/models';
import { JobStore } from '../../stores/job.store';
import {AcErrorStateMatcher} from '../../tools/AcErrorStateMatcher';
import { AvailableWorkerPickerComponent } from '../worker/availableWorkerPicker.component';

@Component({
    selector: 'ac-addJob',
    templateUrl: './addJob.component.html'
})
export class AddJobComponent {

    @ViewChild(AvailableWorkerPickerComponent) picker: AvailableWorkerPickerComponent;

    hasError : boolean = false;
    workersNotAvailable: string = '';

    matcher = new AcErrorStateMatcher();
    jobNumberInput = new FormControl('', [Validators.required]);
    nameInput = new FormControl('', [Validators.required]);
    typeInput = new FormControl('', [Validators.required]);
    startDateInput = new FormControl('', [Validators.required]);
    endDateInput = new FormControl('');
    

    constructor(private jobStore: JobStore,
                private dialogRef: MatDialogRef<AddJobComponent>){ 
    }

    job: AddJobModel = new AddJobModel(0, '', '', new Date());

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onOkClick(): void {

        console.log(this.picker.selectedRows);

        this.job.workerIds = [];
        this.picker.selectedRows.forEach(worker => this.job.workerIds.push(worker.id));

        this.jobStore.addJob(this.job).subscribe( obj => {
             this.dialogRef.close();
        }, err => {
            this.hasError = true;
            this.workersNotAvailable = err["message"];
        });
        
    }

    startDate_DateChange(event: MatDatepickerInputEvent<Date>){
        console.log("date changed");
    }
}