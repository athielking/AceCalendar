import {Component, Input, OnInit} from '@angular/core'
import {ActivatedRoute, Router, ParamMap} from '@angular/router'
import {ITdDataTableColumn, TdLoadingService, TdDialogService} from '@covalent/core';

import {Organization} from '../../models/admin/organization.model'
import {User} from '../../models/admin/user.model'
import {OrganizationStore} from '../../stores/organization.store';

@Component({
    selector: "ac-organization-detail",
    templateUrl: "./organization-detail.component.html"
})
export class OrganizationDetailComponent implements OnInit{
    
    public organization: Organization = new Organization('', '');

    userData: User[] = [];
    userColumns: ITdDataTableColumn[] = [
        {name: 'userName', label: 'Username'},
        {name: 'firstName', label: 'First Name'},
        {name: 'lastName', label: 'Last Name'},
        {name: 'email', label: 'Email'},
    ]

    constructor(public route: ActivatedRoute, 
                public router: Router,
                public organizationStore: OrganizationStore,
                private dialogService: TdDialogService,
                private loadingService: TdLoadingService){
    }

    public ngOnInit(){
        this.toggleShowLoading(true);

        this.route.paramMap
            .subscribe( (params: ParamMap) => 
                this.organizationStore.getOrganization(params.get('id')));

        this.organizationStore.organization.subscribe(org => {
            this.organization = org;
            this.userData = org.users;
            
            this.toggleShowLoading(false);
        });
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('organizationDetailShowLoading');
        } 
        else {
            this.loadingService.resolve('organizationDetailShowLoading');
        }
    }

    private deleteUser(row: any){
        
    }

    private addUser(){
        
    }
}