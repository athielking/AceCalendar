import { Component, Inject } from '@angular/core';
import { AddJobComponent } from './addJob.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { TdLoadingService } from '@covalent/core';
import { CalendarStore } from '../../stores/calendar.store';
import { Observable } from 'rxjs/Observable';
import { AddJobModel } from '../calendar/common/models';

@Component({
    selector: 'ac-addJobToDayView',
    templateUrl: './addJob.component.html'
})
export class AddJobToDayViewComponent extends AddJobComponent {
    constructor(
        private calendarStore: CalendarStore,
        dialog: MatDialog,
        dialogRef: MatDialogRef<AddJobComponent>,
        dialogService: TdDialogService,
        loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) data: any
    ){ 
        super(
            dialog,
            dialogRef,
            dialogService,
            loadingService,
            data
        );
    }

    protected AddJobThroughStore(addJobModel: AddJobModel): Observable<object> {
        return this.calendarStore.addJobToDayView(addJobModel);
    }

    protected EditJobThroughStore(editJobId: string, addJobModel: AddJobModel): Observable<object> {
        return this.calendarStore.editJobFromDayView(editJobId, addJobModel);
    }
}