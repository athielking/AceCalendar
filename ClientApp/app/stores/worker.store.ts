import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { WorkerService } from '../services/worker.service';
import { Worker, Equipment } from '../components/calendar/common/models';

@Injectable()
export class WorkerStore{
    private _workers : BehaviorSubject<List<Worker>> = new BehaviorSubject(List([]));
    private _equipment : BehaviorSubject<List<Equipment>> = new BehaviorSubject(List([]));

    public readonly workers : Observable<List<Worker>> = this._workers.asObservable();
    public readonly equipment : Observable<List<Equipment>> = this._equipment.asObservable();

    public date : Date;

    constructor(private workerService: WorkerService){
    }

    addWorker(worker: Worker){
        var obs = this.workerService.addWorker(worker);
        
        obs.subscribe( response => { 
            this.getWorkers();
        });

        return obs;
    }

    getWorkers(){
        this.workerService.getWorkers().subscribe( result => {
            this._workers.next(List(result));
        })
    }
}