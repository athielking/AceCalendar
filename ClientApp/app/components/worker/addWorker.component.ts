import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';

import { Worker } from '../calendar/common/models';

@Component({
    selector: 'addWorker',
    templateUrl: './addWorker.component.html'
})
export class AddWorkerComponent {

    constructor(
        private dialogRef: MatDialogRef<AddWorkerComponent>
    ) { 
    }

    worker: Worker = new Worker( '', '' , '', '', '' );

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onOkClick(): void {
        //Add Worker
        this.dialogRef.close();
    }
}