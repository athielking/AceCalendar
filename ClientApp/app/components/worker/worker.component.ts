import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import { List } from 'immutable';

import { WorkerStore } from '../../stores/worker.store';
import { Worker } from '../calendar/common/models';
import { AddWorkerComponent } from './addWorker.component';

@Component({
    selector: 'worker',
    templateUrl: './worker.component.html'
})
export class WorkerComponent implements OnInit {
    
    private workers: Worker[];

    public filteredWorkers: BehaviorSubject<List<Worker>> = new BehaviorSubject<List<Worker>>(List([]));

    public showErrorMessage: boolean;
    
    public errorMessage: string;
    
    constructor(
        private workerStore: WorkerStore,
        private loadingService: TdLoadingService,
        private dialog: MatDialog,
        private dialogService: TdDialogService,
        private router: Router
    ) {
    } 
    
    public ngOnInit() {
        this.workerStore.isLoading.subscribe( result => {
            this.toggleShowLoading(result); 
        });

        this.workerStore.hasError.subscribe( result => {
            this.showErrorMessage = result;
            this.errorMessage = this.workerStore.errorMessage;
        });

        this.workerStore.workers.subscribe( result => {
            this.workers = result.toArray();
            this.filterWorkers();          
        });

        this.workerStore.getWorkers();
    }

    public filterWorkers(displayName: string = '') {              
        this.filteredWorkers.next( 
            List(this.workers.filter( (user: Worker) => {
                return (user.firstName + user.lastName).toLowerCase().indexOf(displayName.toLowerCase()) > -1;
        })));
      }

    public addWorker(){
        this.showAddWorkerForm();
    }

    public editWorker(worker: Worker){
        this.router.navigate(['worker', worker.id]);
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

