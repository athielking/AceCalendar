import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { WorkerService } from '../services/worker.service';
import { Worker, AddWorkerModel } from '../components/calendar/common/models';

@Injectable()
export class WorkerStore{
    private _workers : BehaviorSubject<List<Worker>> = new BehaviorSubject(List([]));

    public errorMessage: string;

    public hasError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly workers : Observable<List<Worker>> = this._workers.asObservable();

    constructor(private workerService: WorkerService){
    }

    public addWorker(addWorkerModel: AddWorkerModel){
        var obs = this.workerService.addWorker(addWorkerModel);
        
        obs.subscribe( response => { 
            this.getWorkers();
        }, error => {
        });

        return obs;
    }

    public editWorker(workerId: string, addWorkerModel: AddWorkerModel){
        var obs = this.workerService.editWorker(workerId, addWorkerModel);
        
        obs.subscribe( response => { 
            this.getWorkers();
        }, error => {
        });

        return obs;
    }

    public deleteWorker(userId: string){
        var obs = this.workerService.deleteWorker(userId);

        obs.subscribe( response => {
            this.getWorkers();
        }, error => {
        })
        
        return obs;
    }

    public getWorkers(){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.workerService.getWorkers().subscribe( result => {
            this._workers.next(List(result));
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public getAvailable(date: Date, end?: Date){
        this.workerService.getAvailable(date, end).subscribe( result => {
            this._workers.next(List(result));
        })
    }
}