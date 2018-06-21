import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { OrganizationService } from '../services/organization.service';
import { UserService } from '../services/user.service';
import { Organization } from '../models/admin/organization.model';
import { User } from '../models/admin/user.model';
import { PaymentSource, ProductPlan, SetProductPlanRequest, DefaultPaymentSourceInformation, Subscription, SubscriptionDetails } from '../models/admin/stripe.model';
import { OrganizationDetails } from '../models/admin/organizationDetails.model';
import { SaveOrganizationRequest } from '../models/admin/saveOrganizationRequest.Model';

@Injectable()
export class OrganizationStore{
    private _organizations : BehaviorSubject<Organization[]> = new BehaviorSubject([]);
    // private _organization: BehaviorSubject<Organization> = new BehaviorSubject(new Organization());
    private _productPlans: BehaviorSubject<ProductPlan[]> = new BehaviorSubject([]);
    
    private _organizationDetails: BehaviorSubject<OrganizationDetails> = new BehaviorSubject(new OrganizationDetails());
    private _defaultPaymentSource: BehaviorSubject<DefaultPaymentSourceInformation> = new BehaviorSubject(new DefaultPaymentSourceInformation());
    private _subscriptionDetails: BehaviorSubject<SubscriptionDetails> = new BehaviorSubject(new SubscriptionDetails());
    
    public errorMessage: string;

    public hasError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly organizations : Observable<Organization[]> = this._organizations.asObservable();
    // public readonly organization: Observable<Organization> = this._organization.asObservable();
    public readonly productPlans: Observable<ProductPlan[]> = this._productPlans.asObservable();

    public readonly organizationDetails: Observable<OrganizationDetails> = this._organizationDetails.asObservable();
    public readonly defaultPaymentSource: Observable<DefaultPaymentSourceInformation> = this._defaultPaymentSource.asObservable();
    public readonly subscriptionDetails: Observable<SubscriptionDetails> = this._subscriptionDetails.asObservable();
         
    constructor(
        private organizationService: OrganizationService,
        private userService: UserService
    ){
    }

    public addOrganization(saveOrganizationRequest: SaveOrganizationRequest){
        var obs = this.organizationService.addOrganization(saveOrganizationRequest);
        
        obs.subscribe( response => { 
            this.getOrganizations();
        }, error => {
        });

        return obs;
    }

    public editOrganization(organizationId: string, saveOrganizationRequest: SaveOrganizationRequest){
        var obs = this.organizationService.editOrganization(organizationId, saveOrganizationRequest);
        
        obs.subscribe( response => { 
            this.getOrganizationDetails(organizationId);
        }, error => {
        });

        return obs;
    }

    public deleteOrganization(organizationId: string){
        var obs = this.organizationService.deleteOrganization(organizationId);

        obs.subscribe( response => {
            this.getOrganizations();
        }, error => {
        })
        
        return obs;
    }

    public getDefaultPaymentSource(organizationId: string){
        var observable = this.organizationService.getDefaultPaymentSource(organizationId);
        
        observable.subscribe( defaultPaymentSource => {
            this._defaultPaymentSource.next(defaultPaymentSource);
        }, error => {
        });

        return observable;
    }

    public deleteDefaultPaymentSource(organizationId: string){
        return this.organizationService.deleteDefaultPaymentSource(organizationId);
    }
 
    public cancelSubscription(organizationId: string){
        return this.organizationService.cancelSubscription(organizationId);
    }

    public startTrial(organizationId: string){
        return this.organizationService.startTrial(organizationId);
    }

    public updateDefaultPaymentSource(organizationId: string, sourceToken: any){
        return this.organizationService.updateDefaultPaymentSource(organizationId, sourceToken);
    }

    public addPaymentSource(organizationId: string, sourceToken: any){
        return this.organizationService.addCardPaymentSource(organizationId, sourceToken);
    }

    public organizationHadTrial(organizationId: string){
        return this.organizationService.organizationHadTrial(organizationId);
    }

    public getOrganizations(){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.organizationService.getOrganizations().subscribe( result => {
            this._organizations.next(result);
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    // public getOrganization(id: string){
    //     this.isLoading.next(true);
    //     this.hasError.next(false);

    //     this.organizationService.getOrganization(id).subscribe( result => {
    //         this._organization.next(result);
    //         this.isLoading.next(false);
    //     }, error => {
    //         this.isLoading.next(false);            
    //         this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
    //         this.hasError.next(true);
    //     });
    // }
    
    public getOrganizationDetails(organizationId: string){
        var observable = this.organizationService.getOrganizationDetails(organizationId);
        
        observable.subscribe( organizationDetails => {
            this._organizationDetails.next(organizationDetails);
        }, error => {
        });

        return observable;
    }

    public getSubscriptionDetails(organizationId: string){
        var observable = this.organizationService.getSubscriptionDetails(organizationId);
        
        observable.subscribe( subscription => {
            this._subscriptionDetails.next(subscription);
        }, error => {
        });

        return observable;
    }

    // public addUser(user: User){
    //     var obs = this.userService.addUser(user);

    //     obs.subscribe( response => {
    //         this.getOrganization(user.organizationId);
    //     }, error => {});

    //     return obs;
    // }

    // public editUser(user: User){
    //     var obs = this.userService.editUser(user);

    //     obs.subscribe( response => {
    //         this.getOrganization(user.organizationId);
    //     }, error => {});

    //     return obs;
    // }

    // public deleteUser(user: User){

    //     var obs = this.userService.deleteUser(user.id);

    //     obs.subscribe( response => {
    //         this.getOrganization(user.organizationId);
    //     });

    //     return obs;
    // }

    // public deleteCardPaymentSource(organization: string, cardId: string){
    //     var obs = this.organizationService.deleteCardPaymentSource(organization, cardId);

    //     var sub = obs.subscribe( result => {
    //         this.getOrganization(organization);
    //     }, error => {
    //     }, () => {sub.unsubscribe()});

    //     return obs;
    // }

    // public setDefaultPaymentSource(organizationId: string, cardId: string){
    //     var obs = this.organizationService.setDefaultPaymentSource( organizationId, cardId);

    //     var sub = obs.subscribe(result => {
    //         this.getOrganization(organizationId);
    //     }, error => {
    //     }, () => {sub.unsubscribe});

    //     return obs;
    // }

    public getProductPlans(){
        var observable = this.organizationService.getProductPlans();

        observable.subscribe( productPlans => {
            this._productPlans.next(productPlans);
        }, error => {
        });

        return observable;
    }

    public setProductPlan(organizationId: string, planId: string){
        return this.organizationService.setProductPlan(organizationId, new SetProductPlanRequest(planId));
    }

    public activateSubscription(organizationId: string, planId: string){
        return this.organizationService.activateSubscription(organizationId, new SetProductPlanRequest(planId));
    }

    private handleError(error: any){
        console.log(error);

        this.hasError.next(true)
        if( error.message )
            this.errorMessage = error.message;
        else if( error.error && error.error.errorMessage )
            this.errorMessage = error.error.errorMessage;
    }
}