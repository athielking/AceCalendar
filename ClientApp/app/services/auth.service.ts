import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { LoginModel } from '../components/login/loginModel';

export const TOKEN_NAME: string = 'jwt_token';
export const TOKEN_EXPIRATION: string = 'jwt_token_expiration';
export const LOGGED_IN_USER: string = 'logged_in_user';

@Injectable()
export class AuthService {
     
    private serviceUri: string;
    
    constructor(private httpClient: HttpClient) {
        this.serviceUri = `${environment.webServiceUrl}/api/auth`
    }

    public loginRequired(): boolean {
        var token = this.getToken();
        var tokenExpiration = this.getTokenExpiration();

        return token === null || token.length == 0 || tokenExpiration === null || tokenExpiration < new Date();
    }

    public login(
        loginModel: LoginModel, 
        onSuccess: () => any,
        onFailure: () => any
    ) {

        let url = this.serviceUri+`/login`;

        this.httpClient.post( url, loginModel )
            .subscribe( 
                result => {
                    this.setToken( result["token"] );
                    this.setTokenExpiration( result["expiration"] );
                    this.setLoggedInUser( result["user"])

                    onSuccess();               
                },
                error => {
                    onFailure();
                }
            );
    }

    public logout(
        onSuccess: () => any,
        onFailure: () => any 
    ){
        let url = this.serviceUri+`/logout`;

        this.httpClient.post( url, {} )
            .subscribe( 
                result => {
                    this.clearToken();
                    this.clearTokenExpiration();
                    this.clearLoggedInUser();
                    
                    onSuccess();                 
                },
                error => {
                    onFailure();
                }
            );
    }

    private clearToken(): void {
        localStorage.removeItem(TOKEN_NAME);
    }

    private getToken(): string {
        return localStorage.getItem(TOKEN_NAME);
    }

    private setToken(token: string): void {
        localStorage.setItem(TOKEN_NAME, token);
    }

    private clearTokenExpiration(): void {
        localStorage.removeItem(TOKEN_EXPIRATION);
    }

    private getTokenExpiration(): Date {
        return new Date(localStorage.getItem(TOKEN_EXPIRATION));
    }

    private setTokenExpiration(tokenExpiration: Date): void {
        localStorage.setItem(TOKEN_EXPIRATION, tokenExpiration.toString());
    }

    private clearLoggedInUser(): void {
        localStorage.removeItem(LOGGED_IN_USER);
    }

    public getLoggedInUser(): string {
        return localStorage.getItem(LOGGED_IN_USER);
    }

    private setLoggedInUser(token: string): void {
        localStorage.setItem(LOGGED_IN_USER, token);
    }
}