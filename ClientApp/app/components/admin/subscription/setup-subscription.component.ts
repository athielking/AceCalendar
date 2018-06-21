// import { Component, Input, OnInit, Inject, SimpleChanges } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef, MatRadioChange, MatDialog } from '@angular/material';
// import { TdLoadingService, TdDialogService } from '@covalent/core';
// import { OrganizationStore } from '../../../stores/organization.store';
// import { ProductPlan } from '../../../models/admin/stripe.model';

// @Component({
// 	templateUrl: './setup-subscription.component.html',
// 	styleUrls: ['./setup-subscription.component.scss']
// })
// export class SetupSubscriptionComponent implements OnInit {

// 	@Input() organizationId: string;
// 	@Input() selectedPlanId: string;
// 	@Input() licenseQuantity: number;

// 	public selectedPlan: ProductPlan;
// 	private plans: ProductPlan[] = [];
// 	constructor(private organizationStore: OrganizationStore,
// 				private loadingService: TdLoadingService,
// 				private dialogRef: MatDialogRef<SetupSubscriptionComponent>,
// 				private dialogService: TdDialogService,
// 				@Inject(MAT_DIALOG_DATA) data: any) {

// 					if(data.organizationId)
// 						this.organizationId = data.organizationId;
// 					if(data.selectedPlanId)
// 						this.selectedPlanId = data.selectedPlanId;
// 					if(data.licenseQuantity)
// 						this.licenseQuantity = data.licenseQuantity;
// 				}

// 	ngOnInit() {

// 		this.organizationStore.productPlans.subscribe(result => {
// 			this.plans = result;
// 			if(this.selectedPlanId)
// 				this.selectedPlan = this.getSelectedPlan();
// 		});
		
// 		this.organizationStore.getProductPlans();
// 	}
	
// 	subscriptionChanged(event: MatRadioChange){
// 		this.selectedPlanId = event.value;
// 		this.selectedPlan = this.getSelectedPlan();
// 	}

// 	getSelectedPlan():ProductPlan{
// 		return this.plans.find( p => p.id == this.selectedPlanId );
// 	}

// 	onCancelClick(){
// 		this.dialogRef.close(false);
// 	}

// 	onOkClick(){
	
// 		var sub = this.organizationStore.setProductPlan(this.organizationId, this.licenseQuantity, this.selectedPlanId)
// 			.subscribe(result => {
// 				this.dialogRef.close();
// 			}, error => {
// 				this.dialogService.openAlert({
// 					message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
// 					title: "Failed to Update Subscription"
// 				});
// 			}, () => {sub.unsubscribe()})

// 	}
// }
