import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { TdLoadingService, TdDialogService } from '@covalent/core';
import { TimeOffStore } from '../../stores/timeOff.store';

@Component({
    selector: 'ac-add-time-off',
    templateUrl: './add-time-off.component.html'
})
export class AddTimeOffComponent {

    private idWorker: string;

    public viewDate: Date;
    public timeOffDays: Date[];

    constructor(
        public timeOffStore: TimeOffStore,
        private dialogRef: MatDialogRef<AddTimeOffComponent>,
        private loadingService: TdLoadingService,
        private dialogService: TdDialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){
        this.idWorker = data.idWorker;
        this.timeOffDays = data.timeOffDays;
        this.viewDate = data.viewDate;
    }

    public onOkClick(){
        this.toggleShowLoading(true);

        this.timeOffStore.editTimeOff(this.idWorker, this.viewDate, this.timeOffDays).subscribe(result => {
            this.toggleShowLoading(false);
            this.dialogRef.close();
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Time Off'
            });
        });
    }

    public onCancelClick(){
        this.dialogRef.close();
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('addTimeOffShowLoading');
        } 
        else {
            this.loadingService.resolve('addTimeOffShowLoading');
        }
    }
}