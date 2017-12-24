import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
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
        private dialog: MatDialog
    ) {
    }

    configColumns: ITdDataTableColumn[] = [
      { name: 'name',  label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'phone', label: 'Phone Number' }
    ];
  
    workers: Worker[];
   
    showAddWorkerForm(): void {
        let dialogRef = this.dialog.open(AddWorkerComponent, {
            disableClose: true
          });
      
          dialogRef.afterClosed().subscribe(result => {
            //Refresh Grid
          });
    }

    ngOnInit(){
        //Get page
        this.assetService.getWorkers().subscribe(result => {
            this.workers = result;
        })
    }
  }

