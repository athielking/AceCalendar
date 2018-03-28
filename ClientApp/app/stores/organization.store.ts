import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { OrganizationService } from '../services/organization.service';
import { UserService } from '../services/user.service';
import { Organization } from '../models/admin/organization.model';
import { User } from '../models/admin/user.model';

@Injectable()
export class OrganizationStore{
    private _organizations : BehaviorSubject<Organization[]> = new BehaviorSubject([]);
    private _organization: BehaviorSubject<Organization> = new BehaviorSubject(new Organization('',''));

    public errorMessage: string;

    public hasError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly organizations : Observable<Organization[]> = this._organizations.asObservable();
    public readonly organization: Observable<Organization> = this._organization.asObservable();
    
    constructor(private organizationService: OrganizationService,
                private userService: UserService){
    }

    public addOrganization(organization: Organization){
        var obs = this.organizationService.addOrganization(organization);
        
        obs.subscribe( response => { 
            this.getOrganizations();
        }, error => {
        });

        return obs;
    }

    public editOrganization(organization: Organization){
        var obs = this.organizationService.editOrganization(organization);
        
        obs.subscribe( response => { 
            this.getOrganizations();
        }, error => {
        });

        return obs;
    }

    public deleteOrganization(organizationId: string){
        var obs = this.organizationService.deleteOrganization(organizationId);

        obs.subscribe( response => {
            this.getOrganizations();
        }, error => {
        })
        
        return obs;
    }

    public getOrganizations(){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.organizationService.getOrganizations().subscribe( result => {
            this._organizations.next(result);
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public getOrganization(id: string){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.organizationService.getOrganization(id).subscribe( result => {
            this._organization.next(result);
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public addUser(user: User){
        var obs = this.userService.addUser(user);

        obs.subscribe( response => {
            this.getOrganization(user.organizationId);
        });

        return obs;
    }

    public editUser(user: User){
        var obs = this.userService.editUser(user);

        obs.subscribe( response => {
            this.getOrganization(user.organizationId);
        });

        return obs;
    }

    public deleteUser(user: User){

        var obs = this.userService.deleteUser(user.id);

        obs.subscribe( response => {
            this.getOrganization(user.organizationId);
        });

        return obs;
    }
}