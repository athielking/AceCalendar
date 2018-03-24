import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { Tag } from '../models/tag/tag.model';

@Injectable()
export class TagService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient){
        this.serviceUri = `${environment.webServiceUrl}/api/tag`
    }

    public addTag( tag: Tag){
        if(tag.id == '')
            delete tag.id;
            
        return this.httpClient.post( this.serviceUri, tag ).shareReplay();
    }

    public editTag( tag: Tag ){
        return this.httpClient.put( this.serviceUri + `/${tag.id}`, tag ).shareReplay();
    }

    public deleteTag( id: string ){
        return this.httpClient.delete( this.serviceUri + `/${id}` ).shareReplay();
    }

    public getTags(): Observable<Tag[]>{
        return this.httpClient.get(this.serviceUri)
            .map(json => (<Tag[]>json['data']));
    }

    public getTag(id: string): Observable<Tag>{
        return this.httpClient.get(this.serviceUri + `/${id}`).map(json => (<Tag>json['data']));
    }
}