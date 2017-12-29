import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable()
export class AuthService {
     
    constructor(private http: Http) {
    }
      
    login(email:string, password:string ) {
        // return this.http.post<User>('/api/login', {email, password})
        //     // this is just the HTTP call, 
        //     // we still need to handle the reception of the token
        //     .shareReplay();
    }
}