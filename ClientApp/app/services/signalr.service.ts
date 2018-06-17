import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { CalendarService } from './calendar.service';
import { StorageService } from './storage.service';
import { StorageKeys } from '../components/calendar/common/calendar-tools';
import { DayView } from '../components/calendar/common/models';
import { ORGANIZATION_ID } from './auth.service';

@Injectable()
export class SignalrService {

    private _hubConnection: HubConnection | undefined;
    private _hubUrl: string;

    private _connected: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _dataUpdated: BehaviorSubject<DayView[]> = new BehaviorSubject(null);

    public connected: Observable<boolean> = this._connected.asObservable();
    public dataUpdated: Observable<DayView[]> = this._dataUpdated.asObservable();

    constructor(private calendarService: CalendarService,
                private storageService: StorageService){

        this._hubUrl = environment.webServiceUrl + '/ws';
        
    }

    public connect() : Observable<boolean> {

        if(!this._hubConnection)
            this._hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(this._hubUrl)
                .configureLogging(signalR.LogLevel.Error)
                .build();
        
        var obs = Observable.from( this._hubConnection.start() );
        var sub = obs.subscribe( () => {
            this._connected.next(true);

            this.registerHandlers();

            if(this.storageService.hasItem(ORGANIZATION_ID))
                this.addToGroup(this.storageService.getItem(ORGANIZATION_ID));

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
        this._hubConnection.on("DataUpdated", (data: any) => this.onDataUpdated(data));
    }

    private addedToGroup(organizationId: string){
        console.log("SignalR -- Added to server group " + organizationId);
    }

    private onDataUpdated(data: any) {

        console.log("SignalR -- Data Recieved server")
        let viewDate = new Date(this.storageService.getItem(StorageKeys.viewDate));
        var dayViews = this.calendarService.mapDayViewResponse(viewDate, {data: data});

        this._dataUpdated.next(dayViews);
    }
}