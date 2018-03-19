import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';


import { TagStore } from '../../stores/tag.store';
import { Tag } from '../../models/tag/tag.model';
import { AddTagComponent } from '../../components/tag/add-tag.component';


@Component({
    selector: 'ac-tag-list',
    templateUrl: './tag-list.component.html'
})
export class TagListComponent implements OnInit {
    
    private tags: Tag[];

    public filteredTags: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);

    public showErrorMessage: boolean;
    
    public errorMessage: string;
    
    constructor(
        private tagStore: TagStore,
        private loadingService: TdLoadingService,
        private dialog: MatDialog,
        private dialogService: TdDialogService,
        private router: Router
    ) {
    } 
    
    public ngOnInit() {
        this.tagStore.isLoading.subscribe( result => {
            this.toggleShowLoading(result); 
        });

        this.tagStore.hasError.subscribe( result => {
            this.showErrorMessage = result;
            this.errorMessage = this.tagStore.errorMessage;
        });

        this.tagStore.tags.subscribe( result => {
            this.tags = result;
            this.filterTags();          
        });

        this.tagStore.getTags();
    }

    public filterTags(displayName: string = '') {              
        this.filteredTags.next( 
            this.tags.filter( (tag: Tag) => {
                return (tag.description).toLowerCase().indexOf(displayName.toLowerCase()) > -1;
        }));
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
            tag.color
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
        color: string = ''
    ) {
        let dialogRef = this.dialog.open(AddTagComponent, {
            disableClose: true,
            data: { 
                isEdit: isEdit,
                editId: editId,
                icon: icon,
                description: description,
                color: color,
            }
        });
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