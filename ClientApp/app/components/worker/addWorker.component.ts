import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

import { Worker } from '../calendar/common/models';
import { WorkerStore } from '../../stores/worker.store';
import {AcErrorStateMatcher} from '../../tools/AcErrorStateMatcher';

@Component({
    selector: 'addWorker',
    templateUrl: './addWorker.component.html'
})
export class AddWorkerComponent {

    matcher = new AcErrorStateMatcher();
    firstNameInput = new FormControl('', [Validators.required]);
    lastNameInput = new FormControl('', [Validators.required]);
    emailInput = new FormControl('', [Validators.email]);
    

    constructor(private workerStore: WorkerStore,
                private dialogRef: MatDialogRef<AddWorkerComponent>){ 
    }

    worker: Worker = new Worker( '', '' , '', '', '' );

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onOkClick(): void {
        this.workerStore.addWorker(this.worker).subscribe( obj => {
            console.log("worker added");
            this.dialogRef.close();
        })
        
    }
}