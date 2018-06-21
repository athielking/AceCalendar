import { Component, OnInit } from "@angular/core";
import { OrganizationStore } from "../../../stores/organization.store";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { TdLoadingService } from "@covalent/core";
import { MatDialog } from "@angular/material";
import { AddOrganizationComponent } from "./add-organization.component";

@Component({
    selector: "ac-organization-detail-header",
    templateUrl: "./organization-detail-header.component.html"
})

export class OrganizationDetailHeaderComponent implements OnInit{

    private organizationId: string;

    public addressLine1: string;

    public addressLine2: string;

    private city: string;

    private state: string;

    private zip: string;

    public cityStateZip: string;

    public organizationName: string;

    public email: string;

    public showErrorMessage: boolean;

    public errorMessage: string;

    constructor(
        private organizationStore: OrganizationStore,
        private loadingService: TdLoadingService,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ){
    }

    public ngOnInit(){
        this.toggleShowLoading(true);

        this.route.paramMap.subscribe( (params: ParamMap) => {
            this.organizationId = params.get('id');

            this.organizationStore.getOrganizationDetails(this.organizationId).subscribe( organizationDetails => {
                this.showErrorMessage = false;
                this.errorMessage = null;
                this.toggleShowLoading(false);
            }, error => {
                this.showErrorMessage = true;
                this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;
                this.toggleShowLoading(false);
            });
        });

        this.organizationStore.organizationDetails.subscribe(organizationDetails => {
          
            this.addressLine1 = organizationDetails.addressLine1;
            this.addressLine2 = organizationDetails.addressLine2;
            this.city = organizationDetails.city;
            this.state = organizationDetails.state;
            this.zip = organizationDetails.zip;         
            this.cityStateZip = organizationDetails.cityStateZip;
            this.organizationName = organizationDetails.organizationName;   
            this.email = organizationDetails.email;                
        });
    }

    public editOrganization(){
        let dialogRef = this.dialog.open(AddOrganizationComponent, {
            disableClose: true,
            data: { 
                isEdit: true,
                editId: this.organizationId,
                name: this.organizationName,
                email: this.email,
                address: this.addressLine1,
                addressLine2: this.addressLine2,
                city: this.city,
                state: this.state,
                zip: this.zip
            }
        });
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('organizationDetailHeaderShowLoading');
        } 
        else {
            this.loadingService.resolve('organizationDetailHeaderShowLoading');
        }
    }
}