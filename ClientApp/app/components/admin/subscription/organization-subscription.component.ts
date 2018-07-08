import { Component, OnInit } from "@angular/core";
import { TdLoadingService } from "@covalent/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { OrganizationStore } from "../../../stores/organization.store";
import { SubscriptionDetails } from "../../../models/admin/stripe.model";
import { TdDialogService } from "@covalent/core";
import { MatDialog } from "@angular/material";
import { ActivateSubscriptionComponent } from "./activate-subscription.component";

@Component({
    selector: "ac-organization-subscription",
    templateUrl: "./organization-subscription.component.html"
})

export class OrganizationSubscriptionComponent implements OnInit{

    private organizationId: string;

    public subscriptionDetails: SubscriptionDetails;

    public showErrorMessage: boolean;

    public errorMessage: string;

    public hadTrial: boolean;

    constructor(
        private organizationStore: OrganizationStore,
        private loadingService: TdLoadingService,
        private route: ActivatedRoute,
        private dialogService: TdDialogService,
        public dialog: MatDialog
    ){
    }

    public ngOnInit(){
        this.toggleShowLoading(true);

        this.route.paramMap.subscribe( (params: ParamMap) => {
            this.organizationId = params.get('id');

            this.getSubscriptionDetails();

            this.organizationStore.organizationHadTrial(this.organizationId).subscribe( hadTrial => {
                this.hadTrial = hadTrial;
            }, error => {
                this.hadTrial = true;
            });           
        });

        this.organizationStore.subscriptionDetails.subscribe(subscriptionDetails => {       
            this.subscriptionDetails = subscriptionDetails;                 
        });

        this.organizationStore.defaultPaymentSourceUpdated.subscribe(defaultPaymentSource => {         
            this.getSubscriptionDetails();                
        });
    }

    public activateSubscription(){
        let dialogRef = this.dialog.open(ActivateSubscriptionComponent, {
            disableClose: true,
            data: { 
                organizationId: this.organizationId,
                subscriptionDetails: this.subscriptionDetails
            }
        }).afterClosed().subscribe(() => {
            this.toggleShowLoading(true);
            this.getSubscriptionDetails();
        });
    }

    public cancelSubscription(){
        this.dialogService.openConfirm({
            message: "Are you sure you wish to cancel your subscription? You will be able to continue using Ace Calendar until the end of the billing period.",
            title: 'Confirm Cancel'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);
                
                this.organizationStore.cancelSubscription(this.organizationId)
                    .subscribe(result => {
                        this.getSubscriptionDetails();                     
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Cancel Subscription'
                        });
                    });
            }                
        }); 
    }
    
    public startTrial(){
        this.toggleShowLoading(true);
                
        this.organizationStore.startTrial(this.organizationId)
            .subscribe(result => {
                this.getSubscriptionDetails();                     
            }, error => {
                this.toggleShowLoading(false);
                this.dialogService.openAlert({
                    message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                    title: 'Unable to Start Trial'
                });
            });
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('organizationSubscriptionShowLoading');
        } 
        else {
            this.loadingService.resolve('organizationSubscriptionShowLoading');
        }
    }

    private getSubscriptionDetails() {
        this.organizationStore.getSubscriptionDetails(this.organizationId).subscribe( subscription => {
                this.showErrorMessage = false;
                this.errorMessage = null;
                this.toggleShowLoading(false);
            }, error => {
                this.showErrorMessage = true;
                this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;
                this.toggleShowLoading(false);
            });
    }
}