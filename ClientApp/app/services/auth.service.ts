import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

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

    public login(
        loginModel: LoginModel, 
        onSuccess: () => any,
        onFailure: () => any
    ) {

        let url = this.serviceUri+`/login`;

        this.httpClient.post( url, loginModel )
            .subscribe( 
                result => {
                    this.createToken(
                        loginModel,                
                        () => {
                            onSuccess();
                        },
                        () => {               
                            onFailure();
                        }
                    );                  
                },
                error => {
                    onFailure();
                }
            );
    }

    public logout(
        onSuccess: (result: object) => any,
        onFailure: (error: object) => any 
    ){

    }

    private createToken(
        loginModel: LoginModel, 
        onSuccess: () => any,
        onFailure: () => any
    ) {
        let url = this.serviceUri+`/token`;
        
        this.httpClient.post( url, loginModel )
            .subscribe( 
                result => {
                    //Set token and expiration date
                    onSuccess();                    
                },
                error => {
                    onFailure();
                }
            );
    }
}