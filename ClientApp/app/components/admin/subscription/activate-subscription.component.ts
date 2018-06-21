import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
import { TdDialogService } from '@covalent/core';
import { OrganizationStore } from '../../../stores/organization.store';
import { SubscriptionDetails, ProductPlan, SubscriptionPaymentSource, DefaultPaymentSourceInformation } from '../../../models/admin/stripe.model';

@Component({
  selector: 'ac-activate-subscription',
  templateUrl: './activate-subscription.component.html',
})
export class ActivateSubscriptionComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild("cardInfo") cardInfo : ElementRef;
    
    private card: any;
    
    private cardHandler = this.onChange.bind(this);
    
	private organizationId: string;

    public currentSubscriptionDetails: SubscriptionDetails;
    
    public selectedPlanId: string;

	public showErrorMessage: boolean;
    
    public errorMessage: string;
    
    public showProductPlanErrorMessage: boolean;
    
    public productPlanErrorMessage: string;
    
    public showDefaultPaymentSourceErrorMessage: boolean;
    
    public defaultPaymentSourceErrorMessage: string;

    public productPlans: ProductPlan[];
    
    public subscriptionPaymentSource: SubscriptionPaymentSource = SubscriptionPaymentSource.DefaultSource;
    
    public defaultPaymentSource: DefaultPaymentSourceInformation;
    
    private productPlansLoading: boolean;

    private defaultPaymentSourceLoading: boolean;

	constructor(
		private cd: ChangeDetectorRef, 
		private organizationStore: OrganizationStore,
		private dialogRef: MatDialogRef<ActivateSubscriptionComponent>,
		private loadingService: TdLoadingService,
		private dialogService: TdDialogService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
        this.organizationId = data.organizationId;
        this.currentSubscriptionDetails = data.subscriptionDetails;
	}

    ngOnInit() {
        this.toggleShowLoading(true);

		this.organizationStore.productPlans.subscribe(productPlans => {
			this.productPlans = productPlans;
		});
                
        this.organizationStore.defaultPaymentSource.subscribe(defaultPaymentSource => {  
            this.defaultPaymentSource = defaultPaymentSource;                 
            
            this.subscriptionPaymentSource = defaultPaymentSource ? SubscriptionPaymentSource.DefaultSource : SubscriptionPaymentSource.NewSource;
        });

        this.getProductPlans();
        this.getDefaultPaymentSource();
	}

	ngOnDestroy(){
		this.card.removeEventListener('change', this.cardHandler);
		this.card.destroy();
	}

	ngAfterViewInit(){
		this.card = elements.create('card');
    	this.card.mount(this.cardInfo.nativeElement);

    	this.card.addEventListener('change', this.cardHandler);
	}

	onChange({ error }) {
		if (error) {
			this.showErrorMessage = true;
		 	this.errorMessage = error.message;
		} else {
			this.showErrorMessage = false;			
		  	this.errorMessage = null;
		}
		this.cd.detectChanges();
	}

	public async onOkClick(){
        this.toggleShowLoading(true);

        if(this.subscriptionPaymentSource == SubscriptionPaymentSource.NewSource )
            await this.updatePaymentSourceAndActivateSubscription();
        else
            this.activateSubscription();
	}

    public comparePaymentSources(o1, o2): boolean{
        return (<SubscriptionPaymentSource>o1) == (<SubscriptionPaymentSource>o2);
    }

	public onCancelClick(){
		this.dialogRef.close();
	}

	private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('activateSubscriptionShowLoading');
        } 
        else {
            this.loadingService.resolve('activateSubscriptionShowLoading');
        }
    }

    private activateSubscription() {
        this.organizationStore.activateSubscription(this.organizationId, this.selectedPlanId).subscribe(result => {
                this.toggleShowLoading(false);
                this.dialogService.openAlert({
                    message: "Succesfully activated your subscription",
                    title: "Success"
                });

                this.getDefaultPaymentSource();
                
                this.dialogRef.close();
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: "Failed to Update Subscription"
            });
        });
    }

    private async updatePaymentSourceAndActivateSubscription() {
        const {token, error} = await stripe.createToken(this.card);

		if( error )
		{
			this.toggleShowLoading(false);

			this.dialogService.openAlert({
                message: error.message,
                title: 'Unable to Add Payment Source'
			});
			
			return;
		}
		
		this.organizationStore.updateDefaultPaymentSource(this.organizationId, token).subscribe( result => {
            this.activateSubscription();
		}, error => {
			this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Payment Source'
            });
		});
    }

    private getDefaultPaymentSource() {        
        this.defaultPaymentSourceLoading = true;

        this.organizationStore.getDefaultPaymentSource(this.organizationId).subscribe( paymentSource => {
            this.defaultPaymentSourceLoading = false;
            
            this.showDefaultPaymentSourceErrorMessage = false;
            this.defaultPaymentSourceErrorMessage = null; 

            if(!this.productPlansLoading)
                this.toggleShowLoading(false);
        }, error => {
            this.defaultPaymentSourceLoading = false;

            this.showDefaultPaymentSourceErrorMessage = true;
            this.defaultPaymentSourceErrorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;

            if(!this.productPlansLoading)
                this.toggleShowLoading(false);
        });
    }

    private getProductPlans() {
        this.productPlansLoading = true;

        this.organizationStore.getProductPlans().subscribe( productPlans => {
            this.productPlansLoading = false;

            this.showProductPlanErrorMessage = false;
            this.productPlanErrorMessage = null; 

            if(!this.defaultPaymentSourceLoading)
                this.toggleShowLoading(false);
        }, error => {
            this.productPlansLoading = false;

            this.showProductPlanErrorMessage = true;
            this.productPlanErrorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;

            if(!this.defaultPaymentSourceLoading)
                this.toggleShowLoading(false);
        });
    }
}
