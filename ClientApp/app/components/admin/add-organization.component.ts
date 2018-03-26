import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TdDialogService,TdLoadingService} from '@covalent/core';

import {Organization} from '../../models/admin/organization.model';
import {OrganizationStore} from '../../stores/organization.store';

@Component({
    selector: 'ac-add-organization',
    templateUrl: './add-organization.component.html'
})
export class AddOrganizationComponent {

    private isEdit: boolean;
    private editId: string;

    public name: string;
    public description: string;
    public color: string;

    constructor(
        private organizationStore: OrganizationStore,
        private dialogRef: MatDialogRef<AddOrganizationComponent>,
        private dialogService: TdDialogService,
        private loadingService: TdLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.isEdit = data.isEdit,
        this.editId = data.editId,
        this.name = data.name
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

    private addOrganization() {
        this.toggleShowLoading(true);

        var org = new Organization('', this.name);

        this.organizationStore.addOrganization(org).subscribe( result => {
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

        var org = new Organization( this.editId, this.name );

        this.organizationStore.editOrganization(org).subscribe( result => {
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