import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

import {environment} from '../../environments/environment';

@Injectable()
export class SignalrService {

    private _hubConnection: HubConnection | undefined;
    private _hubUrl: string;

    constructor(){
        this._hubUrl = environment.webServiceUrl + '/ws';
    }

    public connect(){
        if(!this._hubConnection)
            this._hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(this._hubUrl)
                .configureLogging(signalR.LogLevel.Information)
                .build();
        
        this._hubConnection.start().then(() => console.log("SignalR Connected"), err => console.error(err.toString()));

        this._hubConnection.on("AddedToGroup", (id: string) => this.addedToGroup(id));
    }

    public addToGroup(organizationId: string){
        if(!this._hubConnection)
            this.connect();
        
        //this._hubConnection.invoke("AddToGroup", organizationId).catch(err => console.error(err.message));
    }

    private addedToGroup(organizationId: string){
        console.log("Added to server group " + organizationId);
    }

}