import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { WorkerService } from '../services/worker.service';
import { Worker, AddWorkerModel } from '../components/calendar/common/models';

@Injectable()
export class WorkerStore{
    private _workers : BehaviorSubject<List<Worker>> = new BehaviorSubject(List([]));
    private _worker: BehaviorSubject<Worker> = new BehaviorSubject(new Worker('', '', '', '', ''));

    public errorMessage: string;

    public hasError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly workers : Observable<List<Worker>> = this._workers.asObservable();
    public readonly worker: Observable<Worker> = this._worker.asObservable();
    
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

    public getWorker(id: string){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.workerService.getWorker(id).subscribe( result => {
            this._worker.next(result);
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

    public addTimeOff(workerId: string, date: Date, end?: Date): Observable<Worker>{

        this.isLoading.next(true);
        this.hasError.next(false);

        var obs = this.workerService.addTimeOff(workerId, date, end);

        obs.subscribe( response => {
            this.isLoading.next(false);
            if( this._worker.getValue().id == response.id )
                this._worker.next(response);
        }, error => {
            this.isLoading.next(false);
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });

        return obs;
    }

    public deleteTimeOff( workerId: string, date: Date, end?: Date): Observable<Worker>{
        this.isLoading.next(true);
        this.hasError.next(false);

        var obs = this.workerService.deleteTimeOff(workerId, date, end);

        obs.subscribe( response => {
            this.isLoading.next(false);
            if( this._worker.getValue().id == response.id )
                this._worker.next(response);
        }, error => {
            this.isLoading.next(false);
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });

        return obs;
    }
}