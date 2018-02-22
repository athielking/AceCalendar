import {Component, Input, OnInit} from '@angular/core'
import {ActivatedRoute, Router, ParamMap} from '@angular/router'
import {ITdDataTableColumn, TdLoadingService, TdDialogService} from '@covalent/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
import * as date_format from 'date-fns/format';

import {Worker, CalendarJob} from '../calendar/common/models'
import {WorkerStore} from '../../stores/worker.store';
import {TimeOffGridModel} from '../../models/worker/timeOffGridModel';
import {AddTimeOffComponent} from './add-time-off.component';

@Component({
    selector: "ac-worker-detail",
    templateUrl: "./worker-detail.component.html"
})
export class WorkerDetailComponent implements OnInit{
    
    public editMode: Boolean = false;
    public worker: Worker = new Worker('', '', '', '', '');

    public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    timeOffData: TimeOffGridModel[] = [];
    timeOffColumns: ITdDataTableColumn[] = [
        {name: 'date', label: 'Date', format: (value: any) => date_format(value, 'MM/DD/YYYY')},
        {name: 'deleteBtn', label: ''}
    ]

    jobsData: CalendarJob[] = [];
    jobsColumns: ITdDataTableColumn[] = [
        {name: 'number', label: 'Job Number'},
        {name: 'name', label: 'Job Name'}
    ]
    constructor(public route: ActivatedRoute, 
                public router: Router,
                public workerStore: WorkerStore,
                private dialogService: TdDialogService,
                private loadingService: TdLoadingService){
    }

    public ngOnInit(){
        this.toggleShowLoading(true);

        this.route.paramMap
            .subscribe( (params: ParamMap) => 
                this.workerStore.getWorker(params.get('id')));

        this.workerStore.worker.subscribe(worker => {
            this.worker = worker;
            this.timeOffData = this.worker.timeOff.map( value => {
                return new TimeOffGridModel(value);
            });

            this.jobsData = this.worker.jobs;

            this.toggleShowLoading(false);
        });
    }

    public toggleEditMode(): void{
        this.editMode = !this.editMode;
    }

    public phoneIsValid() {
        return !this.worker.phone.includes('_');
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('workerDetailShowLoading');
        } 
        else {
            this.loadingService.resolve('workerDetailShowLoading');
        }
    }

    private deleteTimeOff(row: any){
        this.workerStore.deleteTimeOff(this.worker.id, row["date"]).subscribe(result => {

        });
    }

    private addTimeOff(){
        let dialogRef = this.dialogService.open(AddTimeOffComponent, {
            disableClose: true,
            data: { 
                idWorker: this.worker.id
            }
        });
    }
}