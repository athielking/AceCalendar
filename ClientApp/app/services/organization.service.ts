import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { Organization } from '../models/admin/organization.model';
import { PaymentSource, BankAccount, Card, Subscription, BillingInformation, ProductPlan, SetProductPlanRequest, DefaultPaymentSourceInformation, SubscriptionDetails } from '../models/admin/stripe.model';
import { User } from '../models/admin/user.model';
import { OrganizationDetails } from '../models/admin/organizationDetails.model';
import { SaveOrganizationRequest } from '../models/admin/saveOrganizationRequest.Model';

@Injectable()
export class OrganizationService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient){
        this.serviceUri = `${environment.webServiceUrl}/api/organization`
    }

    public addOrganization( saveOrganizationRequest: SaveOrganizationRequest){ 
        return this.httpClient.post( this.serviceUri, saveOrganizationRequest ).shareReplay();
    }

    public editOrganization( organizationId: string, saveOrganizationRequest: SaveOrganizationRequest){
        return this.httpClient.put( this.serviceUri + `/${organizationId}`, saveOrganizationRequest).shareReplay();
    }

    public deleteOrganization( id: string ){
        return this.httpClient.delete( this.serviceUri + `/${id}` ).shareReplay();
    }

    public getOrganizations(): Observable<Organization[]>{

        return this.httpClient.get(this.serviceUri).map(json => {
            return <Organization[]>json['data']
        });
    }

    public getOrganizationDetails(id: string): Observable<OrganizationDetails> {
        return this.httpClient.get(this.serviceUri + `/getOrganizationDetails?id=${id}`).map(json => (<OrganizationDetails>json['data']));
    } 
    
    public getSubscriptionDetails(id: string): Observable<SubscriptionDetails> {
        return this.httpClient.get(this.serviceUri + `/getSubscriptionDetails?id=${id}`).map(json => (<SubscriptionDetails>json['data']));        
    }

    public getDefaultPaymentSource(id: string): Observable<DefaultPaymentSourceInformation> {
        return this.httpClient.get(this.serviceUri + `/getDefaultPaymentSource?id=${id}`).map(json => (<DefaultPaymentSourceInformation>json['data']));
    } 

    // public getOrganization(id: string): Observable<Organization>{
    //     return this.httpClient.get(this.serviceUri + `/${id}`).map(json => { 
    //         var org = new Organization(json["data"].id, json["data"].name, json["data"].stripe_DefaultSourceId);

    //         if(json['data'].subscription){
    //             let subscription = json['data'].subscription
    //             let sub = new Subscription(
    //                 subscription.planId,
    //                 subscription.productName, 
    //                 subscription.status, 
    //                 subscription.periodEnd, 
    //                 subscription.licenseQuantity,
    //                 subscription.planAmount, 
    //                 subscription.billingScheme,
    //                 subscription.cancelAtPeriodEnd);
                
    //             org.subscription = sub;
    //         }

    //         if(json['data'].billingInformation){
    //             let info = json['data'].billingInformation
    //             let billInfo = new BillingInformation( info.addressLine1, info.addressLine2, info.city, info.state, info.zip, info.phone);
                
    //             org.billingInfo = billInfo;
    //         }

    //         org.users = [];
    //         org.paymentSources = [];

    //         if(json["data"].users){
    //             org.users = json["data"].users.map( record => {
    //                 return new User(record.id, record.email, record.firstName, record.lastName, record.userName, record.organizationId, record.role,'');
    //             });
    //         }

    //         if(json["data"].paymentSources){
    //             org.paymentSources = json["data"].paymentSources.map(record => {
    //                 if(record.type == 1)
    //                     return new BankAccount( record.bankAccount.id, record.bankAccount.id == org.stripe_defaultSourceId,
    //                         record.bankAccount.object, record.bankAccount.bankName, record.bankAccount.last4);
    //                 if(record.type == 2)
    //                     return new Card(record.card.id, record.card.id == org.stripe_defaultSourceId, record.card.object, record.card.addressCity, 
    //                         record.card.addressCountry, record.card.addressLine1, record.card.addressLine2, record.card.addressState, 
    //                         record.card.addressZip, record.card.brand, record.card.exp_month, record.card.exp_year, record.card.last4);
    //             });
    //         }
    //         return org;
    //     });
    // }

    public addCardPaymentSource(organizationId: string, token: any){
        return this.httpClient.post(this.serviceUri + `/addCard/${organizationId}`, token).shareReplay();
    }

    public organizationHadTrial(organizationId: string){
        return this.httpClient.get(this.serviceUri + `/organizationHadTrial/${organizationId}`).map( json => (<boolean>json['data']) );
    }

    public updateDefaultPaymentSource(organizationId: string, token: any){
        return this.httpClient.post(this.serviceUri + `/updateDefaultPaymentSource/${organizationId}`, token).shareReplay();
    }

    public deleteCardPaymentSource(organizationId: string, cardId: string){
        return this.httpClient.get(this.serviceUri + `/deleteCard/${organizationId}/${cardId}`).shareReplay();
    }

    public deleteDefaultPaymentSource(organizationId: string){
        return this.httpClient.get(this.serviceUri + `/deleteDefaultPaymentSource/${organizationId}`).shareReplay();
    }

    public cancelSubscription(organizationId: string){
        return this.httpClient.get(this.serviceUri + `/cancelSubscription/${organizationId}`).shareReplay();
    }

    public setDefaultPaymentSource(organizationId: string, cardId: string){
        return this.httpClient.get(this.serviceUri + `/setDefaultSource/${organizationId}/${cardId}`)
    }
    
    public startTrial(organizationId: string){
        return this.httpClient.get(this.serviceUri + `/startTrial/${organizationId}`).shareReplay();
    }

    public getProductPlans(): Observable<ProductPlan[]>{
        return this.httpClient.get(this.serviceUri + '/productPlans').map( json => (<ProductPlan[]>json['data']) );
    }

    public setProductPlan(organizationId: string, request: SetProductPlanRequest){
        return this.httpClient.post(this.serviceUri + `/productPlans/${organizationId}`, request).shareReplay();
    }

    public activateSubscription(organizationId: string, setProductPlanRequest: SetProductPlanRequest){
        return this.httpClient.post(this.serviceUri + `/activateSubscription/${organizationId}`, setProductPlanRequest).shareReplay();
    }
}