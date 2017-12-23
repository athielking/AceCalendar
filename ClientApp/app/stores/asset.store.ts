import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { AssetService } from '../services/asset.service';
import { Worker, Equipment } from '../components/calendar/common/models';

@Injectable()
export class AssetStore{
    private _workers : BehaviorSubject<List<Worker>> = new BehaviorSubject(List([]));
    private _equipment : BehaviorSubject<List<Equipment>> = new BehaviorSubject(List([]));

    public readonly workers : Observable<List<Worker>> = this._workers.asObservable();
    public readonly equipment : Observable<List<Equipment>> = this._equipment.asObservable();

    public date : Date;

    constructor(private assetService: AssetService){
        this.assetService.getEquipment()
            .subscribe(result => {
                this._equipment.next(List(result));
            });

        this.assetService.getWorkers()
            .subscribe(result => {
                this._workers.next(List(result));
            })
    }

    getAvailableWorkers(date: Date){
        return this.workers.map( list => List(list.toArray().splice(0,Math.floor(Math.random()*list.size)+1)));
    }
}