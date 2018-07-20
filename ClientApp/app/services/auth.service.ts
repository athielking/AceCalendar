import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { LoginModel } from '../components/login/loginModel';
import { JwtHelper } from './jwtHelper.service';
import { IdentityClaimTypes } from '../tools/identityClaimTypes';
import { ChangePasswordModel } from '../models/auth/changePasswordModel';
import { StorageService } from './storage.service';
import { CalendarModel } from '../models/calendar/calendar.model';
import { StorageKeys } from '../components/calendar/common/calendar-tools';

@Injectable()
export class AuthService {
     
    private serviceUri: string;
    
    constructor(private httpClient: HttpClient,
                private jwtHelper: JwtHelper,
                private storageService: StorageService) {
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
                    this.setLoggedInUser( result["user"]);
                    
                    var calendars = result['calendars'].map( item => {
                        return new CalendarModel(item.id, item.calendarName, item.OrganizationId, item.inactive == 'True');
                    });

                    this.storageService.setItem(StorageKeys.userCalendars, JSON.stringify(calendars));
                    
                    var selected = this.storageService.getItem(StorageKeys.selectedCalendar);
                    if( !(selected && calendars.findIndex( c => c.id == selected) != -1) && calendars.length > 0 )
                        this.storageService.setItem(StorageKeys.selectedCalendar, calendars[0].id);
                
                    onSuccess();               
                },
                error => {
                    onFailure();
                }
            );
    }

    public changePassword( model: ChangePasswordModel ){
        let url = this.serviceUri+'/changePassword';

        let obs = this.httpClient.post(url, model);

        obs.subscribe( result => {
            this.setToken( result["token"] );
            this.setTokenExpiration( result["expiration"]);
            this.setLoggedInUser(result["user"]);
        });

        return obs.shareReplay();
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

                    this.storageService.removeItem(StorageKeys.selectedCalendar);
                    
                    onSuccess();                 
                },
                error => {
                    onFailure();
                }
            );
    }

    public isReadonly(){
        if(!this.storageService.hasItem(StorageKeys.tokenName))
            return false;
        
        let token = this.jwtHelper.decode(this.getToken());
        return token[IdentityClaimTypes.Role] == 'Readonly';
    }

    public isEditor(){
        if(!this.storageService.hasItem(StorageKeys.tokenName))
            return false;

        let token = this.jwtHelper.decode(this.getToken());
        return token[IdentityClaimTypes.Role] == 'Admin' || token[IdentityClaimTypes.Role] == 'User' ||  token[IdentityClaimTypes.Role] == 'Organization Admin';
    }

    public isAdmin(){
        if(!this.storageService.hasItem(StorageKeys.tokenName))
            return false;

        let token = this.jwtHelper.decode(this.getToken());
        return token[IdentityClaimTypes.Role] == 'Admin';
    }

    public isOrganizationAdmin(){
        if(!this.storageService.hasItem(StorageKeys.tokenName))
            return false;
        
        let token = this.jwtHelper.decode(this.getToken());
        return token[IdentityClaimTypes.Role] == 'Organization Admin' || token[IdentityClaimTypes.Role] == 'Admin';
    }

    public getOrganizationId(){
        let token = this.jwtHelper.decode(this.getToken());
        return token["OrganizationId"];
    }

    public isSubscriptionActive(){
        let token = this.jwtHelper.decode(this.getToken());
        return token["SubscriptionActive"] == "True";
    }

    private clearToken(): void {
        this.storageService.removeItem(StorageKeys.tokenName);
    }

    private getToken(): string {
        return this.storageService.getItem(StorageKeys.tokenName);
    }

    private setToken(token: string): void {
        this.storageService.setItem(StorageKeys.tokenName, token);
    }

    private clearTokenExpiration(): void {
        this.storageService.removeItem(StorageKeys.tokenExpiration);
    }

    private getTokenExpiration(): Date {
        return new Date(this.storageService.getItem(StorageKeys.tokenExpiration));
    }

    private setTokenExpiration(tokenExpiration: Date): void {
        this.storageService.setItem(StorageKeys.tokenExpiration, tokenExpiration.toString());
    }

    private clearLoggedInUser(): void {
        this.storageService.removeItem(StorageKeys.loggedInUser);
    }

    public getLoggedInUser(): string {
        return this.storageService.getItem(StorageKeys.loggedInUser);
    }

    private setLoggedInUser(token: string): void {
        this.storageService.setItem(StorageKeys.loggedInUser, token);
    }  
}