import { Component, OnInit } from '@angular/core';
import { TdLoadingService, ITdDataTableColumn } from '@covalent/core';
import { Observable } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';

import { AssetService } from '../../services/asset.service';
import { Worker } from '../calendar/common/models';
import { AddWorkerComponent } from './addWorker.component';

@Component({
    selector: 'worker',
    templateUrl: './worker.component.html'
})
export class WorkerComponent implements OnInit {
    
    constructor(
        private assetService: AssetService,
        private loadingService: TdLoadingService,
        private dialog: MatDialog
    ) {
    }

    configColumns: ITdDataTableColumn[] = [
      { name: 'name',  label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'phone', label: 'Phone Number' }
    ];
  
    workers: Worker[];
    filteredWorkers: Worker[];

    showAddWorkerForm(): void {
        let dialogRef = this.dialog.open(AddWorkerComponent, {
            disableClose: true
          });
      
          dialogRef.afterClosed().subscribe(result => {
            //Refresh Grid
          });
    }

    ngOnInit(){
        this.load();
    }

    async load() : Promise<void>{
        try {
            this.loadingService.register('users.list');
            this.workers = await this.assetService.getWorkers().toPromise();
          } finally {
            this.filteredWorkers = Object.assign([], this.workers);
            this.loadingService.resolve('users.list');
          }
    }
    filterUsers(displayName: string = ''): void {
        this.filteredWorkers = this.workers.filter((user: Worker) => {
          return user.firstName.toLowerCase().indexOf(displayName.toLowerCase()) > -1;
        });
      }
  }

