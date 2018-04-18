import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {WorkerStore} from '../../stores/worker.store';
import { TdLoadingService, TdDialogService } from '@covalent/core';

@Component({
    selector: 'ac-add-time-off',
    templateUrl: './add-time-off.component.html'
})
export class AddTimeOffComponent {

    private idWorker: string;
    public startDate: Date;
    public endDate: Date;

    constructor(
        public workerStore: WorkerStore,
        private dialogRef: MatDialogRef<AddTimeOffComponent>,
        private loadingService: TdLoadingService,
        private dialogService: TdDialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){
        this.idWorker = data.idWorker;
        this.startDate = new Date();
    }

    public onOkClick(){
        this.toggleShowLoading(true);

        // this.workerStore.addTimeOff(this.idWorker, this.startDate, this.endDate).subscribe(result => {
        //     this.toggleShowLoading(false);
        //     this.dialogRef.close();
        // }, error => {
        //     this.toggleShowLoading(false);
        //     this.dialogService.openAlert({
        //         message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
        //         title: 'Unable to Add Time Off'
        //     });
        // });
    }

    public onCancelClick(){
        this.dialogRef.close();
    }

    private areDatesValid():Boolean{
        if(this.endDate != null)
            return this.endDate > this.startDate;
        
        return this.startDate != null;
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