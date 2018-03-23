import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatSelectChange} from '@angular/material';
import {TdDialogService,TdLoadingService} from '@covalent/core';
import {Subscription} from 'rxjs/rx';

import {Tag, TagIconList} from '../../models/tag/tag.model';
import {TagStore} from '../../stores/tag.store';

@Component({
    selector: 'ac-select-tag',
    templateUrl: './select-tag.component.html'
})
export class SelectTagComponent implements OnInit, OnDestroy {

    public tags: Tag[];
    public excluded: Tag[];
    public selected: Tag[];

    public tagsSubscription: Subscription;

    constructor(
        private tagStore: TagStore,
        private dialogRef: MatDialogRef<SelectTagComponent>,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.selected = data.selected ? data.selected : [];
        this.excluded = data.excluded ? data.excluded : [];
    }

    public ngOnInit(){
        this.toggleShowLoading(true);

        this.tagsSubscription = this.tagStore.tags.subscribe(result => {            
            this.tags = result;

            for(var i: number = 0; i<this.excluded.length; i++){
                var tag = this.excluded[i];
                var index = this.tags.findIndex(value => value.id == tag.id)

                if( index > -1 )
                    this.tags.splice(index, 1);
            }

            this.toggleShowLoading(false);
        });

        this.tagStore.getTags();
    }

    public ngOnDestroy(){
        this.tagsSubscription.unsubscribe();
    }

    public getTag(idTag:string):Tag{
        return this.tags.find( (value ) => { 
            return value.id == idTag;
        });
    }

    public onCancelClick() {
        this.dialogRef.close(false);
    }

    public onOkClick() {
        this.dialogRef.close(true)
    }

    private addTag() {
        
    }
 
    public compareTags(o1: Tag, o2: Tag): boolean{
        return o1 && o2 && o1.id == o2.id;
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