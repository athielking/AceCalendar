import {Component, Input, OnInit} from '@angular/core'
import {ActivatedRoute, Router, ParamMap} from '@angular/router'
import {ITdDataTableColumn, TdLoadingService, TdDialogService} from '@covalent/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';

import {Worker, CalendarJob} from '../calendar/common/models'
import {WorkerStore} from '../../stores/worker.store';
import {TimeOffGridModel} from '../../models/worker/timeOffGridModel';
import {AddTimeOffComponent} from './add-time-off.component';

@Component({
    selector: "ac-worker-detail",
    templateUrl: "./worker-detail.component.html"
})
export class WorkerDetailComponent implements OnInit{
    public workerId: string;
    
    // jobsData: CalendarJob[] = [];
    // jobsColumns: ITdDataTableColumn[] = [
    //     {name: 'number', label: 'Job Number'},
    //     {name: 'name', label: 'Job Name'}
    // ]

    constructor(
        public route: ActivatedRoute, 
        public router: Router,
    ){
    }

    public ngOnInit(){
        //this.toggleShowLoading(true);

        // this.route.paramMap
        //     .subscribe( (params: ParamMap) => 
        //         this.workerStore.getWorker(params.get('id')));

        // this.workerStore.worker.subscribe(worker => {
        //     this.worker = worker;
        //     this.timeOffData = this.worker.timeOff.map( value => {
        //         return new TimeOffGridModel(value);
        //     });

        //     this.jobsData = this.worker.jobs;

        //     this.toggleShowLoading(false);
        // });
    }
}