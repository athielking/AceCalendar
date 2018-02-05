import {Component, Input, Inject, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ITdDataTableColumn} from '@covalent/core';

import { Worker, AddJobModel, CalendarJob } from '../calendar/common/models';
import { JobStore } from '../../stores/job.store';
import {AcErrorStateMatcher} from '../../tools/AcErrorStateMatcher';
import { AvailableWorkerPickerComponent } from '../worker/availableWorkerPicker.component';

@Component({
    selector: 'ac-jobNotes',
    templateUrl: './jobNotes.component.html'
})
export class JobNotesComponent {

    editing : boolean = false;
    job: CalendarJob;

    constructor(private jobStore: JobStore,
                private snacBarRef: MatSnackBarRef<JobNotesComponent>,
                @Inject(MAT_SNACK_BAR_DATA) public data: any){ 
        this.job = <CalendarJob>data.model;
    }

    toggleEdit() : void{
        this.editing = !this.editing;
    }

    onSaveClick(): void {
        this.jobStore.saveNotes(this.job.id, this.job.notes);
        this.snacBarRef.closeWithAction();
    }

    onCloseClick(): void{
        this.snacBarRef.closeWithAction();
    }
}