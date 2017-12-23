import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Asset, Worker, Equipment } from '../components/calendar/common/models';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';
import * as isSameDay from 'date-fns/is_same_day';

@Injectable()
export class AssetService{

    constructor(private http: Http){
    }

    getAssets(): Observable<Asset[]>{

        let api = `${environment.webServiceUrl}/assets`
        
        return this.http.get(api)
            .map(response => (<Asset[]>response.json()));
    }

    getWorkers(): Observable<Worker[]>{
        let api = `${environment.webServiceUrl}/workers`
        
        return this.http.get(api)
            .map(response => (<Worker[]>response.json()));
    }

    getEquipment(): Observable<Equipment[]>{
        let api = `${environment.webServiceUrl}/equipment`
        
        return this.http.get(api)
            .map(response => (<Equipment[]>response.json()));
    }
}