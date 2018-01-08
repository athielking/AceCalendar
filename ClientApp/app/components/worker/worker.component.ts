import { Component, OnInit } from '@angular/core';
import { TdLoadingService, ITdDataTableColumn } from '@covalent/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
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
    
    constructor(
        private workerStore: WorkerStore,
        private loadingService: TdLoadingService,
        private dialog: MatDialog
    ) {
    }

    configColumns: ITdDataTableColumn[] = [
      { name: 'firstName',  label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'phone', label: 'Phone Number' }
    ];
  
    workers: Worker[];
    filteredWorkers: BehaviorSubject<List<Worker>> = new BehaviorSubject<List<Worker>>(List([]));

    showAddWorkerForm(): void {
        let dialogRef = this.dialog.open(AddWorkerComponent, {
            disableClose: true
          });
      
          dialogRef.afterClosed().subscribe(result => {
            //this.load();
          });
    }

    ngOnInit(){

        this.workerStore.workers.subscribe( result => {
            this.workers = result.toArray();
            this.filterUsers('');
        });

        this.workerStore.getWorkers();
    }

    filterUsers(displayName: string = ''): void {
        this.filteredWorkers.next( 
            List(this.workers.filter( (user: Worker) => {
                return (user.firstName.toLowerCase() + user.lastName.toLowerCase()).indexOf(displayName.toLowerCase()) > -1;
        })));
      }

    delete(userId: string){
        this.workerStore.deleteWorker(userId)
            .subscribe(result => {
                console.log(`User Deleted: ${userId}`)
            });
    }
  }

