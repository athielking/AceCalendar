import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from '../../environments/environment';
import { LoginModel } from '../components/login/loginModel';

@Injectable()
export class AuthService {
     
    private serviceUri: string;
    private token: string = "";
    private tokenExpiration: Date;
    
    constructor(private httpClient: HttpClient) {
        this.serviceUri = `${environment.webServiceUrl}/api/auth`
    }

    public get loginRequired(): boolean {
        return this.token.length == 0 || this.tokenExpiration > new Date();
    }

    public login(loginModel: LoginModel) {
        let api = this.serviceUri+`/login`;

        const headers = new HttpHeaders(
        {
            'Content-Type': 'application/json'
        });

        return this.httpClient.post( api, loginModel, {headers: headers} );
    }
}