import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { User } from '../models/admin/user.model';

@Injectable()
export class UserService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient){
        this.serviceUri = `${environment.webServiceUrl}/api/user`
    }

    public addUser( user: User){ 
        return this.httpClient.post( this.serviceUri, user ).shareReplay();
    }

    public editUser( user: User ){
        return this.httpClient.put( this.serviceUri + `/${user.id}`, user).shareReplay();
    }

    public deleteUser( id: string ){
        return this.httpClient.delete( this.serviceUri + `/${id}` ).shareReplay();
    }
}