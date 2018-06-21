import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

import {AuthService} from './auth.service';

@Injectable()
export class SubscriptionGuard implements CanActivate{
    
    constructor(private authService: AuthService, private router: Router){
    }

    public canActivate(): boolean {
        if( this.authService.isSubscriptionActive() || this.authService.isAdmin() )
            return true;
        else {
            this.router.navigate(['calendar-readonly']);
            return false;
        }
    }
}