import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Worker, Equipment } from '../components/calendar/common/models';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';
import * as isSameDay from 'date-fns/is_same_day';

@Injectable()
export class AssetService{

    private serviceUri: string;

    constructor(private http: Http){
        this.serviceUri = `${environment.webServiceUrl}/api/worker`
    }

    getWorkers(): Observable<Worker[]>{
        return this.http.get(this.serviceUri)
            .map(response => (<Worker[]>response.json().data));
    }

    getAvailableWorkers(date: Date) : Observable<Worker[]>{
        let api = this.serviceUri + `/getAvailableWorkers?date=${date.toISOString()}`

        return this.http.get(api)
            .map(response => {
                return response.json().data.map(item => {
                    return new Worker(item.id, item.firstName, item.lastName, item.phone, item.email);
                })
            });
    }

    getEquipment(): Observable<Equipment[]>{
        let api = `${environment.webServiceUrl}/equipment`
        
        return this.http.get(api)
            .map(response => (<Equipment[]>response.json()));
    }
}