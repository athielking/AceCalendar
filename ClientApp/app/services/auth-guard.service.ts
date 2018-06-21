import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardEditor implements CanActivate{
    
    constructor(private authService: AuthService, private router: Router){
    }

    public canActivate(): boolean {
        if( this.authService.isEditor() )
            return true;
        else{
            this.router.navigate(['calendar-readonly']);
            return false;
        }
    }
}

@Injectable()
export class AuthGuardAdmin implements CanActivate{
    
    constructor(private authService: AuthService, private router: Router){
    }

    public canActivate(): boolean {
        if( this.authService.isAdmin())
            return true;
        else{
            this.router.navigate(['calendar-readonly']);
            return false;
        }
    }
}

@Injectable()
export class AuthGuardOrganizationAdmin implements CanActivate{
    
    constructor(private authService: AuthService, private router: Router){
    }

    public canActivate(): boolean {
        if( this.authService.isOrganizationAdmin())
            return true;
        else{
            this.router.navigate(['calendar-readonly']);
            return false;
        }
    }
}