import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { Worker } from '../components/calendar/common/models';

@Injectable()
export class WorkerService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient){

        this.serviceUri = `${environment.webServiceUrl}/api/worker`
    }

    addWorker( worker: Worker ){
        const headers = new HttpHeaders(
            {
                'Content-Type': 'application/json'
            });

        return this.httpClient.post( this.serviceUri, worker, {headers: headers} ).shareReplay();
    }

    deleteWorker( userId: string ){
        return this.httpClient.delete( this.serviceUri + `/${userId}` ).shareReplay();
    }

    getWorkers(): Observable<Worker[]>{
        return this.httpClient.get(this.serviceUri)
            .map(json => (<Worker[]>json['data']));
    }

    getAvailable(date: Date, end?: Date): Observable<Worker[]>{

        let api = this.serviceUri+`/getAvailableWorkers?start=${date.toISOString()}`;
        if(end)
            api = api + `&end=${end.toISOString()}`;

        return this.httpClient.get(api)
            .map(json => (<Worker[]>json['data']));
    }
}