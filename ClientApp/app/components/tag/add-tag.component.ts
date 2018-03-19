import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TdDialogService,TdLoadingService} from '@covalent/core';

import {Tag, TagIconList} from '../../models/tag/tag.model';
import {TagStore} from '../../stores/tag.store';

@Component({
    selector: 'ac-add-tag',
    templateUrl: './add-tag.component.html'
})
export class AddTagComponent {

    private isEdit: boolean;
    private editId: string;

    public iconOptions: string[] = TagIconList;
    public icon: string;
    public description: string;
    public color: string;

    constructor(
        private tagStore: TagStore,
        private dialogRef: MatDialogRef<AddTagComponent>,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.isEdit = data.isEdit,
        this.editId = data.editId,
        this.icon = data.icon,
        this.description = data.description,
        this.color = data.color
    }

    public onCancelClick() {
        this.dialogRef.close();
    }

    public onOkClick() {
        if(this.isEdit)
            this.editWorker();
        
        else
            this.addTag();
    }

    private addTag() {
        this.toggleShowLoading(true);

        var tag = new Tag('', this.icon, this.description, this.color);

        this.tagStore.addTag(tag).subscribe( result => {
            this.dialogRef.close();
            this.toggleShowLoading(false);
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Tag'
            });
        } ); 
    }

    private editWorker() {
        this.toggleShowLoading(true);

        var editTag = new Tag( this.editId, this.icon, this.description, this.color);

        this.tagStore.editTag(editTag).subscribe( result => {
            this.dialogRef.close();
            this.toggleShowLoading(false);
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Update Tag'
            });
        } ); 
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('addTagShowLoading');
        } 
        else {
            this.loadingService.resolve('addTagShowLoading');
        }
    }
}