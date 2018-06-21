import { Component, OnInit } from "@angular/core";
import { TdLoadingService } from "@covalent/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { OrganizationStore } from "../../../stores/organization.store";
import { PaymentSource, DefaultPaymentSourceInformation } from "../../../models/admin/stripe.model";
import { MatDialog } from "@angular/material";
import { AddPaymentSourceComponent } from "./add-paymentsource.component";
import { TdDialogService } from "@covalent/core";

@Component({
    selector: "ac-default-paymentsource",
    templateUrl: "./default-paymentsource.component.html"
})

export class DefaultPaymentSourceComponent implements OnInit{

    private organizationId: string;

    public defaultPaymentSource: DefaultPaymentSourceInformation;

    public showErrorMessage: boolean;

    public errorMessage: string;

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

            this.getDefaultPaymentSource();
        });

        this.organizationStore.defaultPaymentSource.subscribe(defaultPaymentSource => {         
            this.defaultPaymentSource = defaultPaymentSource;                 
        });
    }

    public addPaymentSource(){
        let dialogRef = this.dialog.open(AddPaymentSourceComponent, {
            disableClose: true,
            data: { 
                organizationId: this.organizationId
            }
        }).afterClosed().subscribe(() => {
            this.toggleShowLoading(true);
            this.getDefaultPaymentSource();
        });
    }

    public deleteDefaultPaymentSource(){

        this.dialogService.openConfirm({
            message: "Are you sure you wish to delete this payment method?",
            title: 'Confirm Delete'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);
                
                this.organizationStore.deleteDefaultPaymentSource(this.organizationId)
                    .subscribe(result => {
                        this.getDefaultPaymentSource();                     
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete Payment Source'
                        });
                    });
            }                
        }); 
    }

    private getDefaultPaymentSource() {        
    
        this.organizationStore.getDefaultPaymentSource(this.organizationId).subscribe( paymentSource => {
            this.showErrorMessage = false;
            this.errorMessage = null; 
            this.toggleShowLoading(false);
        }, error => {
            this.showErrorMessage = true;
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;
            this.toggleShowLoading(false);
        });
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('defaultPaymentSourceShowLoading');
        } 
        else {
            this.loadingService.resolve('defaultPaymentSourceShowLoading');
        }
    }
}