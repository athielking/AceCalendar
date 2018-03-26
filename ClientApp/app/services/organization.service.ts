import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { Organization } from '../models/admin/organization.model';

@Injectable()
export class OrganizationService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient){
        this.serviceUri = `${environment.webServiceUrl}/api/organization`
    }

    public addOrganization( organization: Organization){ 
        return this.httpClient.post( this.serviceUri, organization ).shareReplay();
    }

    public editOrganization( organization: Organization ){
        return this.httpClient.put( this.serviceUri + `/${organization.id}`, organization).shareReplay();
    }

    public deleteOrganization( id: string ){
        return this.httpClient.delete( this.serviceUri + `/${id}` ).shareReplay();
    }

    public getOrganizations(): Observable<Organization[]>{
        return this.httpClient.get(this.serviceUri)
            .map(json => {
                return (<Organization[]>json['records'])});
    }

    public getOrganization(id: string): Observable<Organization>{
        return this.httpClient.get(this.serviceUri + `/${id}`).map(json => (<Organization>json['data']));
    }
}