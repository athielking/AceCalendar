import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { Worker, Equipment } from '../components/calendar/common/models';

@Injectable()
export class WorkerService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient,
                private http: Http ){

        this.serviceUri = `${environment.webServiceUrl}/api/worker`
    }

    addWorker( worker: Worker ){
        const headers = new HttpHeaders(
            {
                'Content-Type': 'application/json'
            });

        return this.httpClient.post(this.serviceUri, worker, {headers: headers} ).shareReplay();
    }

    getWorkers(): Observable<Worker[]>{
        return this.httpClient.get(this.serviceUri)
            .map(json => (<Worker[]>json['data']));
    }
}