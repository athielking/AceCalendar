import {Component, Inject} from '@angular/core';
import {MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ITdDataTableColumn, TdDialogService} from '@covalent/core';

import { CalendarJob } from '../calendar/common/models';
import { JobStore } from '../../stores/job.store';

@Component({
    selector: 'ac-jobNotes',
    templateUrl: './jobNotes.component.html'
})
export class JobNotesComponent {

    editing : boolean = false;
    job: CalendarJob;

    constructor(
        private jobStore: JobStore,
        private snacBarRef: MatSnackBarRef<JobNotesComponent>,
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private dialogService: TdDialogService 
    ){ 
        this.job = <CalendarJob>data.model;

        window.setTimeout(()=>{
            if(!this.editing)
                this.snacBarRef.closeWithAction();
        }, 5000);
    }

    toggleEdit() : void{
        this.editing = !this.editing;
    }

    onSaveClick(): void {
        this.jobStore.saveNotes(this.job.id, this.job.notes).subscribe( result => {
            this.snacBarRef.closeWithAction();
        }, error => {
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Update Notes'
            });
        });
    }

    onCloseClick(): void{
        this.snacBarRef.closeWithAction();
    }
}