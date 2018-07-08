import { Component, OnInit, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import { List } from 'immutable';

import { WorkerStore } from '../../stores/worker.store';
import { Worker, AddWorkerModel } from '../calendar/common/models';
import { AddWorkerComponent } from './addWorker.component';
import { SelectWorkerTagComponent } from '../tag/selectWorkerTag.component';
import { Tag } from '../../models/tag/tag.model';
import { TagStore } from '../../stores/tag.store';

@Component({
    selector: 'worker',
    templateUrl: './worker.component.html'
})
export class WorkerComponent implements OnInit {
    
    private workers: Worker[];

    public currentFilter: string;

    public filteredWorkers: BehaviorSubject<Worker[]> = new BehaviorSubject<Worker[]>([]);

    public hasFilteredWorkers: boolean;

    public hasWorkers: boolean;

    public showErrorMessage: boolean;
    
    public errorMessage: string;
    
    public availableTags: Tag[] = new Array<Tag>();

    public tagFilter: Tag[] = new Array<Tag>();

    constructor(
        private workerStore: WorkerStore,
        private loadingService: TdLoadingService,
        private dialog: MatDialog,
        private dialogService: TdDialogService,
        private tagStore: TagStore,
        private router: Router
    ) {
    } 
    
    public ngOnInit() { 
        this.filteredWorkers.subscribe( filteredWorkers => {
            this.hasFilteredWorkers = filteredWorkers.length > 0;
        });

        this.workerStore.isLoading.subscribe( result => {
            this.toggleShowLoading(result); 
        });

        this.workerStore.hasError.subscribe( result => {
            this.showErrorMessage = result;
            this.errorMessage = this.workerStore.errorMessage;
        });

        this.workerStore.workers.subscribe( workers => {
            this.workers = workers;
            this.hasWorkers = workers.length > 0;
            this.filterWorkers();          
        });

        this.tagStore.tags.subscribe(result => {            
            this.availableTags = result;
        });

        this.tagStore.getWorkerTags();

        this.workerStore.getWorkers();
    }
    
    onTagFilterChange(tagFilter: Tag[]){
        this.tagFilter = tagFilter;
        this.filterWorkers(this.currentFilter);
    }

    public filterWorkers(filter: string = '') {      
        this.currentFilter = filter;

        this.filteredWorkers.next( 
            this.workers.filter( (worker: Worker) => {
                var nameMatches = (worker.firstName + worker.lastName).toLowerCase().indexOf(filter.toLowerCase()) > -1
                var tagsMatch = this.tagsMatchFilter(worker);

                return nameMatches && tagsMatch;
        }));
    }

    public removeFilter(){
        this.tagFilter = []; 
        this.filterWorkers();
    }

    public addWorker(){
        this.showAddWorkerForm();
    }

    public editWorker(worker: Worker){
        this.showAddWorkerForm(
            true,
            worker.id,            
            worker.firstName,
            worker.lastName,
            worker.email,
            worker.phone
        );
    }

    public viewWorker(worker: Worker){
        this.router.navigate(['worker', worker.id]);
    }

    public addWorkerTags(worker: Worker){

        var selectTagsRef = this.dialog.open(SelectWorkerTagComponent, {
            data: {
                selected: worker.tags
            }
        });

        selectTagsRef.afterClosed().subscribe( result => {
            if(!result)
                return;

            worker.tags = selectTagsRef.componentInstance.selected;

            var addWorkerModel = new AddWorkerModel(worker.firstName, worker.lastName, worker.email, worker.phone, worker.tags);
            
            this.workerStore.editWorker(worker.id, addWorkerModel).subscribe( result => {
                this.toggleShowLoading(false);
            }, error => {
                this.toggleShowLoading(false);
                this.dialogService.openAlert({
                    message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                    title: 'Unable to Update Worker Tags'
                });
            } );              
        });
    }

    public deleteWorker(workerId: string){
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this worker?',
            title: 'Confirm Delete'
          }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);

                this.workerStore.deleteWorker(workerId)
                    .subscribe(result => {
                        this.toggleShowLoading(false);                        
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete Worker'
                        });
                    });
            }
          });
    }

    private tagsMatchFilter(worker: Worker){
        var tagsMatch = true;

        this.tagFilter.forEach( tag => 
        {
            if(!worker.tags.some( workerTag => workerTag.id === tag.id)){
                tagsMatch = false;
                return;
            }
        });

        return tagsMatch;
    }

    private showAddWorkerForm(
        isEdit: boolean = false,
        editWorkerId: string = '',
        firstName: string = '',
        lastName: string = '',
        email: string = '',
        phone: string = ''
    ) {
        let dialogRef = this.dialog.open(AddWorkerComponent, {
            disableClose: true,
            data: { 
                isEdit: isEdit,
                editWorkerId: editWorkerId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone
            }
        });
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('showLoading');
        } 
        else {
            this.loadingService.resolve('showLoading');
        }
    }
}

