import {Component, Input, OnInit} from '@angular/core'
import {ActivatedRoute, Router, ParamMap} from '@angular/router'
import {ITdDataTableColumn, TdLoadingService, TdDialogService} from '@covalent/core';
import {MatDialog} from '@angular/material';

import {Organization} from '../../models/admin/organization.model'
import {User} from '../../models/admin/user.model'
import {OrganizationStore} from '../../stores/organization.store';
import { AddUserComponent } from './add-user.component';
import { SignalrService } from '../../services/signalr.service';

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
                public dialog: MatDialog,
                private dialogService: TdDialogService,
                private loadingService: TdLoadingService,
                private signalrService: SignalrService){
    }

    public ngOnInit(){
        this.toggleShowLoading(true);

        this.signalrService.connect();

        this.route.paramMap
            .subscribe( (params: ParamMap) => {
                this.organizationStore.getOrganization(params.get('id'));
                this.signalrService.addToGroup(params.get('id'));
            });

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

    private deleteUser(user: User){
        this.organizationStore.deleteUser(user);
    }

    private editUser(user: User){
        this.dialog.open(AddUserComponent, {data: {
            isEdit: true,
            editId: user.id,
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userRole: user.role,
            organizationId: this.organization.id
        }}).afterClosed().subscribe( result => {
            this.organizationStore.getOrganization(this.organization.id);
        })
    }

    private addUser(){
        this.dialog.open(AddUserComponent, {data: {
            organizationId: this.organization.id
        }}).afterClosed().subscribe( result => {
            this.organizationStore.getOrganization(this.organization.id);
        })
    }
}