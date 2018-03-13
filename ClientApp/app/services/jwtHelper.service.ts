import { Injectable } from '@angular/core';
//import { TOKEN_NAME } from './auth.service';

@Injectable()
export class JwtHelper {

    // public getToken(){
    //     return localStorage.getItem(TOKEN_NAME);
    // }

    public decode( token: string ): any{
        let split = token.split('.');

        if( split.length != 3 )
            throw new Error('The token does not appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more info');
        
        let output = split[1].replace(/-/g, '+').replace(/_/g, '/');

        switch(output.length % 4)
        {
            case 0:
                break;
            case 2:
                output += "==";
                break;
            case 3:
                output += "=";
                break;
            case 4:
                throw 'Illegal base64url string';
        }

        let decoded = window.atob(output);
        let json = JSON.parse(decoded);
        return json;
    }
}