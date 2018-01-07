import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';

import { Worker } from '../calendar/common/models';
import { WorkerStore } from '../../stores/worker.store';

@Component({
    selector: 'addWorker',
    templateUrl: './addWorker.component.html'
})
export class AddWorkerComponent {

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