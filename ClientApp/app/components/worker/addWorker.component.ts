import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TdDialogService,TdLoadingService} from '@covalent/core';

import {AddWorkerModel} from '../calendar/common/models';
import {WorkerStore} from '../../stores/worker.store';

@Component({
    selector: 'addWorker',
    templateUrl: './addWorker.component.html'
})
export class AddWorkerComponent {

    private isEdit: boolean;
    private editWorkerId: string;

    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;

    public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    constructor(
        private workerStore: WorkerStore,
        private dialogRef: MatDialogRef<AddWorkerComponent>,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.isEdit = data.isEdit,
        this.editWorkerId = data.editWorkerId,
        this.firstName = data.firstName,
        this.lastName = data.lastName,
        this.email = data.email,
        this.phone = data.phone
    }

    public onCancelClick() {
        this.dialogRef.close();
    }

    public onOkClick() {
        if(this.isEdit)
            this.editWorker();
        
        else
            this.addWorker();
    }

    public phoneIsValid() {
        return !this.phone.includes('_');
    }

    private addWorker() {
        this.toggleShowLoading(true);

        var addWorkerModel = new AddWorkerModel(this.firstName, this.lastName, this.email, this.phone);

        this.workerStore.addWorker(addWorkerModel).subscribe( result => {
            this.dialogRef.close();
            this.toggleShowLoading(false);
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Worker'
            });
        } ); 
    }

    private editWorker() {
        this.toggleShowLoading(true);

        var addWorkerModel = new AddWorkerModel(this.firstName, this.lastName, this.email, this.phone);

        this.workerStore.editWorker(this.editWorkerId, addWorkerModel).subscribe( result => {
            this.dialogRef.close();
            this.toggleShowLoading(false);
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Update Worker'
            });
        } ); 
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('addWorkerShowLoading');
        } 
        else {
            this.loadingService.resolve('addWorkerShowLoading');
        }
    }
}