import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
import { TdDialogService } from '@covalent/core';
import { OrganizationStore } from '../../../stores/organization.store';

@Component({
  selector: 'ac-add-paymentsource',
  templateUrl: './add-paymentsource.component.html',
  styleUrls: ['./add-paymentsource.component.scss']
})
export class AddPaymentSourceComponent implements AfterViewInit, OnDestroy {

	@ViewChild("cardInfo") cardInfo : ElementRef;
	private card: any;
	private cardHandler = this.onChange.bind(this);
	private organizationId: string;

	public showErrorMessage: boolean;
    
    public errorMessage: string;
    

	constructor(
		private cd: ChangeDetectorRef, 
		private organizationStore: OrganizationStore,
		private dialogRef: MatDialogRef<AddPaymentSourceComponent>,
		private loadingService: TdLoadingService,
		private dialogService: TdDialogService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.organizationId = data.organizationId;
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

	async onOkClick(){
		this.toggleShowLoading(true);

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
			this.toggleShowLoading(false);
			this.dialogRef.close();
		}, error => {
			this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Payment Source'
            });
		});
	}

	public onCancelClick(){
		this.dialogRef.close();
	}

	private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('addPaymentSourceShowLoading');
        } 
        else {
            this.loadingService.resolve('addPaymentSourceShowLoading');
        }
    }
}
