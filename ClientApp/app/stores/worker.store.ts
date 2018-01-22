import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { WorkerService } from '../services/worker.service';
import { Worker } from '../components/calendar/common/models';

@Injectable()
export class WorkerStore{
    private _workers : BehaviorSubject<List<Worker>> = new BehaviorSubject(List([]));

    public readonly workers : Observable<List<Worker>> = this._workers.asObservable();

    constructor(private workerService: WorkerService){
    }

    addWorker(worker: Worker){
        var obs = this.workerService.addWorker(worker);
        
        obs.subscribe( response => { 
            this.getWorkers();
        });

        return obs;
    }

    deleteWorker(userId: string){
        var obs = this.workerService.deleteWorker(userId);

        obs.subscribe( response => {
            this.getWorkers();
        })
        
        return obs;
    }

    getWorkers(){
        this.workerService.getWorkers().subscribe( result => {
            this._workers.next(List(result));
        })
    }

    getAvailable(date: Date, end?: Date){
        this.workerService.getAvailable(date, end).subscribe( result => {
            this._workers.next(List(result));
        })
    }
}