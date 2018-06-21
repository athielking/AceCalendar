import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TdDialogService,TdLoadingService} from '@covalent/core';
import { OrganizationStore } from '../../../stores/organization.store';
import { Organization } from '../../../models/admin/organization.model';
import { SaveOrganizationRequest } from '../../../models/admin/saveOrganizationRequest.Model';

@Component({
    selector: 'ac-add-organization',
    templateUrl: './add-organization.component.html'
})
export class AddOrganizationComponent {

    private isEdit: boolean;
    private editId: string;

    public name: string;
    public email: string;
    public address: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zip: string;

    constructor(
        private organizationStore: OrganizationStore,
        private dialogRef: MatDialogRef<AddOrganizationComponent>,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.isEdit = data.isEdit,
        this.editId = data.editId,
        this.name = data.name,
        this.email = data.email,
        this.address = data.address,
        this.addressLine2 = data.addressLine2,
        this.city = data.city,
        this.state = data.state,
        this.zip = data.zip
    }

    public onCancelClick() {
        this.dialogRef.close();
    }

    public onOkClick() {
        if(this.isEdit)
            this.editOrganization();
        else
            this.addOrganization();
    }

    public stateIsValid() {
        return /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/.test(this.state ? this.state.toUpperCase() : "" );
    }

    public zipIsValid() {
        return /^[0-9]{5}$/.test(this.zip);
    }

    private addOrganization() {
        this.toggleShowLoading(true);

        var saveOrganizationRequest = new SaveOrganizationRequest(
            this.name,
            this.email,
            this.address,
            this.addressLine2,
            this.city,
            this.state.toUpperCase(),
            this.zip
        );

        this.organizationStore.addOrganization(saveOrganizationRequest).subscribe( result => {
            this.dialogRef.close();
            this.toggleShowLoading(false);
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Add Organization'
            });
        } ); 
    }

    private editOrganization() {
        this.toggleShowLoading(true);

        var saveOrganizationRequest = new SaveOrganizationRequest(
            this.name,
            this.email,
            this.address,
            this.addressLine2,
            this.city,
            this.state.toUpperCase(),
            this.zip
        );
        this.organizationStore.editOrganization(this.editId, saveOrganizationRequest).subscribe( result => {
            this.dialogRef.close();
            this.toggleShowLoading(false);
        }, error => {
            this.toggleShowLoading(false);
            this.dialogService.openAlert({
                message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                title: 'Unable to Update Organization'
            });
        } ); 
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('addOrganizationShowLoading');
        } 
        else {
            this.loadingService.resolve('addOrganizationShowLoading');
        }
    }
}