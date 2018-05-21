import { Component, Inject } from '@angular/core';
import { SelectTagComponent } from './select-tag.component';
import { TagStore } from '../../stores/tag.store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { TdLoadingService } from '@covalent/core';

@Component({
    selector: 'ac-select-tag',
    templateUrl: './select-tag.component.html'
})
export class SelectWorkerTagComponent extends SelectTagComponent {
    constructor(
        tagStore: TagStore,
        dialogRef: MatDialogRef<SelectTagComponent>,
        dialogService: TdDialogService,
        loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){ 
        super(
            tagStore,
            dialogRef,
            dialogService,
            loadingService,
            data
        );
    }

    protected GetTags(tagStore: TagStore) {
        tagStore.getWorkerTags();
    }
}