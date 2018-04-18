import {Component, OnInit, Input} from '@angular/core'
import {ActivatedRoute, ParamMap, Router} from '@angular/router'
import {TdLoadingService} from '@covalent/core';

import {Worker} from '../calendar/common/models'
import {WorkerStore} from '../../stores/worker.store';
import { TdDialogService } from '@covalent/core';
import { AddWorkerComponent } from './addWorker.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: "ac-worker-detail-header",
    templateUrl: "./worker-detail-header.component.html"
})
export class WorkerDetailHeaderComponent implements OnInit{   
    private workerId: string;
    
    public firstName: string;
    
    public lastName: string;
    
    public email: string = "";

    public phone: string;

    constructor(
        private workerStore: WorkerStore,
        private loadingService: TdLoadingService,
        private route: ActivatedRoute,
        private dialogService: TdDialogService,
        private dialog: MatDialog,
        private router: Router
    ){
    }

    public ngOnInit(){
        this.toggleShowLoading(true);

        this.route.paramMap.subscribe( (params: ParamMap) => {
            this.workerStore.getWorker(params.get('id'))
        });

        this.workerStore.worker.subscribe(worker => {
            this.workerId = worker.id;
            this.firstName = worker.firstName;
            this.lastName = worker.lastName;
            this.email = worker.email;
            this.phone = worker.phone;
            
            this.toggleShowLoading(false);
        });
    }

    public editWorker(){
        let dialogRef = this.dialog.open(AddWorkerComponent, {
            disableClose: true,
            data: { 
                isEdit: true,
                editWorkerId: this.workerId,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                phone: this.phone
            }
        });
    }

    public deleteWorker(){
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this worker?',
            title: 'Confirm Delete'
          }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);

                this.workerStore.deleteWorker(this.workerId)
                    .subscribe(result => {
                        this.toggleShowLoading(false);     
                        this.router.navigate(['worker']);                   
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

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('workerDetailHeaderShowLoading');
        } 
        else {
            this.loadingService.resolve('workerDetailHeaderShowLoading');
        }
    }
}