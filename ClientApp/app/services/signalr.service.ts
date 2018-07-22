import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { CalendarService } from './calendar.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { StorageKeys } from '../components/calendar/common/calendar-tools';
import { DayView } from '../components/calendar/common/models';

@Injectable()
export class SignalrService {

    private _hubConnection: HubConnection | undefined;
    private _hubUrl: string;

    private _connected: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _dataUpdated: BehaviorSubject<DayView[]> = new BehaviorSubject(null);

    public connected: Observable<boolean> = this._connected.asObservable();
    public dataUpdated: Observable<DayView[]> = this._dataUpdated.asObservable();

    constructor(private calendarService: CalendarService,
                private authService: AuthService,
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
            this.addToGroup(this.authService.getOrganizationId());
            
            if(this.storageService.hasItem(StorageKeys.selectedCalendar))
                this.addToGroup(this.storageService.getItem(StorageKeys.selectedCalendar));
            
            this.addToGroup(this.authService.getLoggedInUser());


        }, error => {
            this._connected.next(false);
        }, () =>{sub.unsubscribe()});

        return this.connected;
    }

    public disconnect(){
        this.removeFromGroup(this.authService.getOrganizationId());
        if(this.storageService.hasItem(StorageKeys.selectedCalendar))
            this.removeFromGroup(this.storageService.getItem(StorageKeys.selectedCalendar));
            
        this.removeFromGroup(this.authService.getLoggedInUser());

        this._hubConnection.stop();
        this._hubConnection.off('AddedToGroup');
        this._hubConnection.off('RemovedFromGroup');
        this._hubConnection.off('DataUpdated');
        this._hubConnection.off('UserDataUpdated');
    }

    public addToGroup(groupId: string){
        let sub = this.connected.subscribe( result => {
            if(result)
                this._hubConnection.invoke("AddToGroup", groupId).catch(err => console.error(err.message));
        }, null, ()=> {sub.unsubscribe()});
    }

    public removeFromGroup(groupId: string){
        let sub = this.connected.subscribe( result => {
            if(result)
                this._hubConnection.invoke("RemoveFromGroup", groupId).catch(err => console.error(err.message));
        }, null, ()=> {sub.unsubscribe()});
    }

    private registerHandlers(){
        this._hubConnection.on("AddedToGroup", (id: string) => this.addedToGroup(id));
        this._hubConnection.on("RemovedFromGroup", (id: string) => this.removedFromGroup(id));
        this._hubConnection.on("DataUpdated", (data: any) => this.onDataUpdated(data));
        this._hubConnection.on("UserDataUpdated", (data: any) => this.onUserDataUpdated(data));
    }

    private addedToGroup(organizationId: string){
        console.log("SignalR -- Added to server group " + organizationId);
    }

    private removedFromGroup(groupId: string){
        console.log("SignalR -- Removed from server group " + groupId);
    }

    private onDataUpdated(data: any) {

        console.log("SignalR -- Data Recieved server")
        let viewDate = new Date(this.storageService.getItem(StorageKeys.viewDate));
        var dayViews = this.calendarService.mapDayViewResponse(viewDate, {data: data});

        this._dataUpdated.next(dayViews);
    }

    private onUserDataUpdated(data: any){
        var calendars = this.calendarService.mapCalendarResponse(data);
        this.storageService.setItem(StorageKeys.userCalendars, JSON.stringify(calendars));

        var selected = this.storageService.getItem(StorageKeys.selectedCalendar);
        if( selected && calendars.findIndex( c => c.id == selected) == -1 )
            this.storageService.removeItem(StorageKeys.selectedCalendar);
    }
}