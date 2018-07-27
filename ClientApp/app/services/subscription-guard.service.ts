import {Injectable, OnDestroy} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Subscription, Observable} from 'rxjs/Rx';

import {AuthService} from './auth.service';
import { OrganizationStore } from '../stores/organization.store';
import { ValidateSubscription } from '../models/admin/validateSubscription.model';

@Injectable()
export class SubscriptionGuard implements CanActivate{
    
    private interval: number = (1000 * 60 * 5);

    private lastChecked: number;
    private validationModel: ValidateSubscription;
    private sub: Subscription;
    
    constructor(private authService: AuthService,
                private router: Router){
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if( this.authService.isAdmin())
            return Observable.of(true);;

        return this.authService.getSubscriptionValidation().map( result => {
            if(result.isValid)
                return true;
            else if( !result.isValid && result.allowCalendarEdit )
            {
                if(state.url.indexOf('calendar-records') > -1)
                    return true;
            }
            
            this.router.navigate(['calendar-readonly']);
            return false;
        });
    }
}