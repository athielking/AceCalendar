import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';


import { TagStore } from '../../stores/tag.store';
import { Tag } from '../../models/tag/tag.model';


@Component({
    selector: 'worker',
    templateUrl: './worker.component.html'
})
export class WorkerComponent implements OnInit {
    
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

    public editWorker(worker: Worker){
        // this.showAddWorkerForm(
        //     true,
        //     worker.id,            
        //     worker.firstName,
        //     worker.lastName,
        //     worker.email,
        //     worker.phone
        // );
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
        editWorkerId: string = '',
        firstName: string = '',
        lastName: string = '',
        email: string = '',
        phone: string = ''
    ) {
        // let dialogRef = this.dialog.open(AddTagComponent, {
        //     disableClose: true,
        //     data: { 
        //         isEdit: isEdit,
        //         editWorkerId: editWorkerId,
        //         firstName: firstName,
        //         lastName: lastName,
        //         email: email,
        //         phone: phone
        //     }
        // });
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