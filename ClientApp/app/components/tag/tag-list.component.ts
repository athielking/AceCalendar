import { Component, OnInit } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';


import { TagStore } from '../../stores/tag.store';
import { Tag, TagType } from '../../models/tag/tag.model';
import { AddTagComponent } from '../../components/tag/add-tag.component';
import { StorageService } from '../../services/storage.service';
import { StorageKeys } from '../calendar/common/calendar-tools';


@Component({
    selector: 'ac-tag-list',
    templateUrl: './tag-list.component.html'
})
export class TagListComponent implements OnInit {

    private tags: Tag[];

    public currentFilter: string;

    public filteredTags: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);

    public hasFilteredTags: boolean;

    public hasTags: boolean;

    public showErrorMessage: boolean;
    
    public errorMessage: string;
    
    public tagTypeOptions: any[] = [{
        name: 'All',
        value: -1,
      }, {
        name: 'Jobs and Workers',
        value: TagType.JobsAndWorkers,
      }, {
        name: 'Jobs Only',
        value: TagType.Jobs,
      },
      {
        name: 'Workers Only',
        value: TagType.Workers,
      }];

    public tagTypeSortKey: number = this.tagTypeOptions[0].value;

    constructor(
        private tagStore: TagStore,
        private storageService: StorageService,
        private loadingService: TdLoadingService,
        private dialog: MatDialog,
        private dialogService: TdDialogService,
    ) {
    } 
    
    public ngOnInit() {
        this.storageService.watchStorage().subscribe( key => {
            if( key != StorageKeys.selectedCalendar)
                return;
            
            this.tagStore.getTags();
        })

        this.filteredTags.subscribe( filteredTags => {
            this.hasFilteredTags = filteredTags.length > 0;
        });

        this.tagStore.isLoading.subscribe( result => {
            this.toggleShowLoading(result); 
        });

        this.tagStore.hasError.subscribe( result => {
            this.showErrorMessage = result;
            this.errorMessage = this.tagStore.errorMessage;
        });

        this.tagStore.tags.subscribe( tags => {
            this.tags = tags;
            this.hasTags = tags.length > 0;
            this.filterTags();          
        });

        this.tagStore.getTags();
    }

    public filterByTagType(): void {
        this.filterTags(this.currentFilter);
    }

    public filterTags(filter: string = '') {    
        this.currentFilter = filter;

        this.filteredTags.next( 
            this.tags.filter( (tag: Tag) => {
                return (tag.description).toLowerCase().indexOf(filter.toLowerCase()) > -1 && this.tagTypeMatchesCurrentFilter(tag);
        }));
    }

    public removeFilter(){
        this.tagTypeSortKey = -1;
        this.filterTags();
    }

    public addTag(){
        this.showAddTagForm();
    }

    public editTag(tag: Tag){
        this.showAddTagForm(
            true,
            tag.id,            
            tag.icon, 
            tag.description, 
            tag.color,
            tag.tagType
        );
    }

    public deleteTag(tagId: string){
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this tag?',
            title: 'Confirm Delete'
          }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);

                this.tagStore.deleteTag(tagId)
                    .subscribe(result => {
                        this.toggleShowLoading(false);                        
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete Tag'
                        });
                    });
            }
          });
    }

    private showAddTagForm(
        isEdit: boolean = false,
        editId: string = '',
        icon: string = '',
        description: string = '',
        color: string = '',
        tagType: TagType = TagType.JobsAndWorkers
    ) {
        let dialogRef = this.dialog.open(AddTagComponent, {
            disableClose: true,
            data: { 
                isEdit: isEdit,
                editId: editId,
                icon: icon,
                description: description,
                color: color,
                tagType: tagType
            }
        });
    }

    private tagTypeMatchesCurrentFilter(tag: Tag) : boolean {
        if(this.tagTypeSortKey === -1)
            return true;
        
        return tag.tagType === <TagType>this.tagTypeSortKey;
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('showTagsLoading');
        } 
        else {
            this.loadingService.resolve('showTagsLoading');
        }
    }
}