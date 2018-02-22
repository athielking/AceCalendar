import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { Worker, AddWorkerModel } from '../components/calendar/common/models';
import { DateRangeModel } from '../models/shared/dateRangeModel';

@Injectable()
export class WorkerService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient){
        this.serviceUri = `${environment.webServiceUrl}/api/worker`
    }

    public addWorker( addWorkerModel: AddWorkerModel){
        return this.httpClient.post( this.serviceUri, addWorkerModel ).shareReplay();
    }

    public editWorker( workerId: string, addWorkerModel: AddWorkerModel){
        return this.httpClient.put( this.serviceUri + `/${workerId}`, addWorkerModel ).shareReplay();
    }

    public deleteWorker( workerId: string ){
        return this.httpClient.delete( this.serviceUri + `/${workerId}` ).shareReplay();
    }

    public getWorkers(): Observable<Worker[]>{
        return this.httpClient.get(this.serviceUri)
            .map(json => (<Worker[]>json['data']));
    }

    public getWorker(id: string): Observable<Worker>{
        return this.httpClient.get(this.serviceUri + `/${id}`).map(json => (<Worker>json['data']));
    }

    public getAvailable(date: Date, end?: Date): Observable<Worker[]>{

        let api = this.serviceUri+`/getAvailableWorkers?start=${date.toISOString()}`;
        if(end)
            api = api + `&end=${end.toISOString()}`;

        return this.httpClient.get(api)
            .map(json => (<Worker[]>json['data']));
    }

    public addTimeOff(id: string, date: Date, end?:Date){
        var body = new DateRangeModel(id, date, end);

        return this.httpClient.post(this.serviceUri+`/addTimeOff`, body )
            .map(json => <Worker>json['data']).shareReplay();
    }

    public deleteTimeOff(id: string, date: Date, end?: Date){
        var body = new DateRangeModel(id, date, end);

        return this.httpClient.post(this.serviceUri+`/deleteTimeOff`, body )
            .map(json => <Worker>json['data']).shareReplay();
    }
}