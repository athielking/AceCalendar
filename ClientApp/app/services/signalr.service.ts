import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import {environment} from '../../environments/environment';

@Injectable()
export class SignalrService {

    private _hubConnection: HubConnection | undefined;
    private _hubUrl: string;

    private _connected: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _dataUpdated: BehaviorSubject<Date> = new BehaviorSubject(null);

    public connected: Observable<boolean> = this._connected.asObservable();
    public dataUpdated: Observable<Date> = this._dataUpdated.asObservable();

    constructor(){
        this._hubUrl = environment.webServiceUrl + '/ws';
    }

    public connect() : Observable<boolean> {
        if(!this._hubConnection)
            this._hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(this._hubUrl)
                .configureLogging(signalR.LogLevel.Information)
                .build();
        
        var obs = Observable.from( this._hubConnection.start() );
        var sub = obs.subscribe( () => {
            this._connected.next(true);
        }, error => {
            this._connected.next(false);
        }, () =>{sub.unsubscribe()});

        return this.connected;
    }

    public addToGroup(organizationId: string){
        let sub = this.connected.subscribe( result => {
            if(result)
                this._hubConnection.invoke("AddToGroup", organizationId).catch(err => console.error(err.message));
        }, null, ()=> {sub.unsubscribe()});
    }

    private registerHandlers(){
        this._hubConnection.on("AddedToGroup", (id: string) => this.addedToGroup(id));
        this._hubConnection.on("DataUpdated", (date: string) => this.onDataUpdated(date));
    }

    private addedToGroup(organizationId: string){
        console.log("Added to server group " + organizationId);
    }

    private onDataUpdated(date: string) {
        var ymd = date.substr(0, date.indexOf("T")).split("-");
        let d: Date = new Date(+ymd[0], (+ymd[1])-1, +ymd[2]);

        this._dataUpdated.next(d);
    }
}