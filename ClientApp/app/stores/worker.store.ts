import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { WorkerService } from '../services/worker.service';
import { Worker, AddWorkerModel, WorkerDto } from '../components/calendar/common/models';

@Injectable()
export class WorkerStore{

    private _workers : BehaviorSubject<Worker[]> = new BehaviorSubject([]);

    private _worker: BehaviorSubject<Worker> = new BehaviorSubject(new Worker('', '', '', '', '', []));

    public errorMessage : string;

    public hasError : BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading : BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly workers : Observable<Worker[]> = this._workers.asObservable();

    public readonly worker : Observable<Worker> = this._worker.asObservable();

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
            this.getWorker(workerId);
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

        this.workerService.getWorkers().subscribe( workerDtos => {
            this._workers.next(workerDtos.map( workerDto => this.createWorker(workerDto)));
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

        this.workerService.getWorker(id).subscribe( workerDto => {
            this._worker.next(this.createWorker(workerDto));
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public getAvailable(date: Date, end?: Date){
        this.workerService.getAvailable(date, end).subscribe( result => {
            this._workers.next(result);
        })
    }

    private createWorker(workerDto: WorkerDto) : Worker {
        return new Worker(
            workerDto.id,
            workerDto.firstName,
            workerDto.lastName,
            workerDto.email,
            workerDto.phone,
            workerDto.tags
        );
    }
}