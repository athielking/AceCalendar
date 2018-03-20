import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TdDialogService,TdLoadingService} from '@covalent/core';

import {Tag, TagIconList} from '../../models/tag/tag.model';
import {TagStore} from '../../stores/tag.store';

@Component({
    selector: 'ac-select-tag',
    templateUrl: './select-tag.component.html'
})
export class SelectTagComponent implements OnInit {

    public tags: Tag[];
    public selected: Tag[];

    constructor(
        private tagStore: TagStore,
        private dialogRef: MatDialogRef<SelectTagComponent>,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        
    }

    public ngOnInit(){
        this.toggleShowLoading(true);

        this.tagStore.tags.subscribe(result => {
            this.tags = result;
            this.toggleShowLoading(false);
        });

        this.tagStore.getTags();
    }

    public getTag(idTag:string):Tag{
        return this.tags.find( (value ) => { 
            return value.id == idTag;
        });
    }

    public onCancelClick() {
        this.dialogRef.close();
    }

    public onOkClick() {
        console.log(this.selected);
    }

    private addTag() {
        
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('selectTagShowLoading');
        } 
        else {
            this.loadingService.resolve('selectTagShowLoading');
        }
    }
}