import {Component, Input, OnInit} from '@angular/core'
import {ActivatedRoute, ParamMap} from '@angular/router'
import {ITdDataTableColumn, TdLoadingService, TdDialogService} from '@covalent/core';
import {MatDialog} from '@angular/material';
import { Organization } from '../../../models/admin/organization.model';
import { PaymentSource } from '../../../models/admin/stripe.model';
import { User } from '../../../models/admin/user.model';
import { OrganizationStore } from '../../../stores/organization.store';
//import { AddUserComponent } from '../add-user.component';

@Component({
    selector: "ac-organization-detail",
    templateUrl: "./organization-detail.component.html",
    styleUrls: ["./organization-detail.component.scss"]
})
export class OrganizationDetailComponent implements OnInit{
    
    // userData: User[] = [];
    // userColumns: ITdDataTableColumn[] = [
    //     {name: 'userName', label: 'Username'},
    //     {name: 'firstName', label: 'First Name'},
    //     {name: 'lastName', label: 'Last Name'},
    //     {name: 'email', label: 'Email'},
    // ]

    constructor(
        public route: ActivatedRoute, 
        // public organizationStore: OrganizationStore,
        public dialog: MatDialog,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService
    ){
    }

    public ngOnInit(){
        //this.toggleShowLoading(true);

        // this.route.paramMap
        //     .subscribe( (params: ParamMap) => {
        //         this.organizationStore.getOrganization(params.get('id'));
        //     });

        // this.organizationStore.organization.subscribe(org => {
        //     this.organization = org;
        //     this.userData = org.users;
        //     this.paymentSources = org.paymentSources;

        //     this.toggleShowLoading(false);
        // });
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('organizationDetailShowLoading');
        } 
        else {
            this.loadingService.resolve('organizationDetailShowLoading');
        }
    }

    // private deleteUser(user: User){
    //     this.organizationStore.deleteUser(user);
    // }

    // private editUser(user: User){
    //     this.dialog.open(AddUserComponent, {data: {
    //         isEdit: true,
    //         editId: user.id,
    //         userName: user.userName,
    //         email: user.email,
    //         firstName: user.firstName,
    //         lastName: user.lastName,
    //         userRole: user.role,
    //         organizationId: this.organization.id
    //     }}).afterClosed().subscribe( result => {
    //         this.organizationStore.getOrganization(this.organization.id);
    //     })
    // }

    // private addUser(){
    //     this.dialog.open(AddUserComponent, {data: {
    //         organizationId: this.organization.id
    //     }}).afterClosed().subscribe( result => {
    //         this.organizationStore.getOrganization(this.organization.id);
    //     })
    // }

    // public addPaymentSource(){
    //     this.dialog.open(AddPaymentsourceComponent, {data: {
    //         organizationId: this.organization.id
    //     }}).afterClosed().subscribe( result => {
    //         this.organizationStore.getOrganization(this.organization.id);
    //     });
    // }

    // public deletePaymentSource(source: PaymentSource){

    //     this.dialogService.openConfirm({
    //         message: "Are you sure you wish to delete this payment source?",
    //         title: 'Confirm Delete'
    //     }).afterClosed().subscribe((accept: boolean) => {
    //         if (accept) {
    //             this.toggleShowLoading(true);
                
    //             this.organizationStore.deleteCardPaymentSource(this.organization.id, source.id)
    //                 .subscribe(result => {
    //                     this.toggleShowLoading(false);                        
    //                 }, error => {
    //                     this.toggleShowLoading(false);
    //                     this.dialogService.openAlert({
    //                         message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
    //                         title: 'Unable to Delete Payment Source'
    //                     });
    //                 });
    //         }
                
    //     });        
    // }

    // public editPaymentSource(source: PaymentSource){
    //     this.toggleShowLoading(true);
                
    //     this.organizationStore.setDefaultPaymentSource(this.organization.id, source.id)
    //         .subscribe(result => {
    //             this.toggleShowLoading(false);                        
    //         }, error => {
    //             this.toggleShowLoading(false);
    //             this.dialogService.openAlert({
    //                 message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
    //                 title: 'Unable to Set Default Payment Source'
    //             });
    //         });
    // }

    // public editSubscription(){
    //     this.dialog.open(SetupSubscriptionComponent, {
    //         data: {
    //             organizationId: this.organization.id,
    //             selectedPlanId: this.organization.subscription ? null : this.organization.subscription.planId,
    //             licenseQuantity: this.organization.subscription ? null : this.organization.subscription.licenseQuantity
    //     }});
    // }

    // public setupSubscription(){

    //     if(!this.paymentSources || this.paymentSources.length == 0){
    //         this.dialogService.openAlert({
    //             message: "Please add a payment source before setting up your subscription",
    //             title: "No Payment Sources"
    //         });
    //         return;
    //     }
        
    //     this.dialog.open(SetupSubscriptionComponent, {
    //         data: {
    //             organizationId: this.organization.id,
    //     }});
    // }

    // public cancelSubscription(){

    // }
}