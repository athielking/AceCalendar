import {Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import {ITdDataTableColumn} from '@covalent/core';

import { Worker } from '../calendar/common/models';
import { WorkerStore } from '../../stores/worker.store';

@Component({
    selector: 'ac-availableWorkers',
    templateUrl: './availableWorkerPicker.component.html'
})
export class AvailableWorkerPickerComponent implements OnInit, OnChanges{
    @Input() date: Date;
    @Input() endDate?: Date;
    @Input() hideTitle?: Boolean;

    public selectedRows: Worker[] = [];

    dataLoading: boolean = true;
    data: Worker[] = [];
    columns: ITdDataTableColumn[] = [
        {name: "firstName", label: 'First Name'},
        {name: 'lastName', label: 'Last Name'}
    ]

    constructor(private workerStore: WorkerStore)
    {
    }

    ngOnInit(){
        this.workerStore.workers.subscribe(result => {
            this.data = result;
            this.dataLoading = false;
        })

        this.workerStore.getAvailable(this.date);
    }

    ngOnChanges(changes: SimpleChanges){
        if(changes.date)
        {
            this.date = changes.date.currentValue;
            if(!this.dataLoading)
            {
            this.dataLoading = true;
            this.workerStore.getAvailable(this.date, this.endDate);
            }
        }

        if(changes.endDate){
            this.endDate = changes.endDate.currentValue;
            if(!this.dataLoading)
            {
            this.dataLoading = true;
            this.workerStore.getAvailable(this.date, this.endDate);
            }
        }
    }
}