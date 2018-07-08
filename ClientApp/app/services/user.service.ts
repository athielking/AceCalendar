import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { AddUserModel, EditUserModel } from '../models/admin/user.model';

@Injectable()
export class UserService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient){
        this.serviceUri = `${environment.webServiceUrl}/api/user`
    }

    public addUserToOrganization( organizationId: string, user: AddUserModel){ 
        return this.httpClient.post(this.serviceUri + `/addUserToOrganization/${organizationId}`, user).shareReplay();    
    }

    public editUser( organizationId: string, user: EditUserModel ){
        return this.httpClient.put( this.serviceUri + `/editOrganizationUser/${organizationId}`, user).shareReplay();
    }

    public deleteUser( id: string ){
        return this.httpClient.delete( this.serviceUri + `/${id}` ).shareReplay();
    }
}