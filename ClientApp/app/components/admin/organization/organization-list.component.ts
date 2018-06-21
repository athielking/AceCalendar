import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import { Organization } from '../../../models/admin/organization.model';
import { OrganizationStore } from '../../../stores/organization.store';
import { AddOrganizationComponent } from './add-organization.component';

@Component({
    selector: 'ac-organization-list',
    templateUrl: './organization-list.component.html'
})
export class OrganizationListComponent implements OnInit {
    
    private organizations: Organization[];

    public filteredOrganizations: BehaviorSubject<Organization[]> = new BehaviorSubject<Organization[]>([]);

    public showErrorMessage: boolean;
    
    public errorMessage: string;
    
    constructor(
        private organizationStore: OrganizationStore,
        private loadingService: TdLoadingService,
        private dialog: MatDialog,
        private dialogService: TdDialogService,
        private router: Router
    ) {
    } 
    
    public ngOnInit() {
        this.organizationStore.isLoading.subscribe( result => {
            this.toggleShowLoading(result); 
        });

        this.organizationStore.hasError.subscribe( result => {
            this.showErrorMessage = result;
            this.errorMessage = this.organizationStore.errorMessage;
        });

        this.organizationStore.organizations.subscribe( result => {
            this.organizations = result;
            this.filterOrganizations();          
        });

        this.organizationStore.getOrganizations();
    }

    public filterOrganizations(displayName: string = '') {              
        this.filteredOrganizations.next( 
            this.organizations.filter( (org: Organization) => {
                return (org.name).toLowerCase().indexOf(displayName.toLowerCase()) > -1;
        }));
      }

    public addOrganization(){
        let dialogRef = this.dialog.open(AddOrganizationComponent, {
            disableClose: true,
            data: { 
            }
        });
    }

    public deleteOrganization(orgId: string){
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this organization?',
            title: 'Confirm Delete'
          }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);

                this.organizationStore.deleteOrganization(orgId)
                    .subscribe(result => {
                        this.toggleShowLoading(false);                        
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete Organization'
                        });
                    });
            }
          });
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('showOrganizationsLoading');
        } 
        else {
            this.loadingService.resolve('showOrganizationsLoading');
        }
    }
}