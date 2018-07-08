import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { Organization } from '../models/admin/organization.model';
import { PaymentSource, BankAccount, Card, Subscription, BillingInformation, ProductPlan, SetProductPlanRequest, DefaultPaymentSourceInformation, SubscriptionDetails } from '../models/admin/stripe.model';
import { OrganizationDetails } from '../models/admin/organizationDetails.model';
import { SaveOrganizationRequest } from '../models/admin/saveOrganizationRequest.Model';
import { UserGridModel } from '../models/admin/userGridModel';

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

    public getOrganizationUsers(organizationId: string): Observable<UserGridModel[]>{
        return this.httpClient.get(this.serviceUri + `/getOrganizationUsers?id=${organizationId}`).map(json => (<UserGridModel[]>json['data']));
    }

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