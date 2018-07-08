import { Component, OnInit } from "@angular/core";
import { OrganizationStore } from "../../../stores/organization.store";
import { TdLoadingService } from "@covalent/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { TdDialogService } from "@covalent/core";
import { MatDialog } from "@angular/material";
import { TdDataTableSortingOrder } from "@covalent/core";
import { UserGridModel } from "../../../models/admin/userGridModel";
import { ITdDataTableColumn } from "@covalent/core";
import { TdDataTableService } from "@covalent/core";
import { ITdDataTableSortChangeEvent } from "@covalent/core";
import { IPageChangeEvent } from "@covalent/core";
import { BehaviorSubject } from "rxjs";
import { addSeconds } from "date-fns";
import { AddUserComponent } from "./add-user.component";
import { Roles } from "../../../models/admin/user.model";

@Component({
    selector: "ac-organization-users",
    templateUrl: "./organization-users.component.html",
    styleUrls: ["./organization-users.component.scss"]
})

export class OrganizationUsersComponent implements OnInit{

    private currentPage: number;

    private organizationId: string;

    public currentFilter: string;

    public showErrorMessage: boolean;

    public errorMessage: string;

    public filteredUsers: BehaviorSubject<UserGridModel[]> = new BehaviorSubject<UserGridModel[]>([]);

    public hasFilteredUsers: boolean;

    public hasUsers: boolean;

    public organizationUsersData: UserGridModel[] = [];
    
    public pageSize: number = 5;

    public usersDataCount: number;

    public usersDataPage: UserGridModel[] = [];

    public userRoles: any[] = [{
        name: 'All',
        value: 'all',
      }, {
        name: 'Readonly',
        value: Roles.Readonly,
      }, {
        name: 'User',
        value: Roles.User,
      }, {
        name: 'Organization Admin',
        value: Roles.OrganizationAdmin,
      }, {
        name: 'Admin',
        value: Roles.Admin,
      }];

    public roleSortKey: string = this.userRoles[0].value;

    constructor(
        private organizationStore: OrganizationStore,
        private loadingService: TdLoadingService,
        private route: ActivatedRoute,
        private dialogService: TdDialogService,
        public dialog: MatDialog,
        private dataTableService: TdDataTableService
    ){
    }

    public ngOnInit(){
        this.currentPage = 1;

        this.toggleShowLoading(true);

        this.route.paramMap.subscribe( (params: ParamMap) => {
            this.organizationId = params.get('id');     
            
            this.organizationStore.getOrganizationUsersData(this.organizationId).subscribe( subscription => {
                this.showErrorMessage = false;
                this.errorMessage = null;
                this.toggleShowLoading(false);
            }, error => {
                this.showErrorMessage = true;
                this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;
                this.toggleShowLoading(false);
            });
        });

        this.organizationStore.organizationUsersData.subscribe(organizationUsersData => {
            this.organizationUsersData = organizationUsersData;

            this.hasUsers = organizationUsersData.length > 0;

            this.filterUsers();
        });

        this.filteredUsers.subscribe( filteredUsers =>
        {
            this.hasFilteredUsers = filteredUsers.length > 0;
            this.updatePageOfData(filteredUsers);

            this.usersDataCount = filteredUsers.length;
        });
    }  
    
    public removeFilter(){
        this.roleSortKey = this.userRoles[0].value;
        this.filterUsers();
    }

    public filterByRole(): void {
        this.filterUsers(this.currentFilter);
    }

    public filterUsers(filter: string = '') {      
        this.currentFilter = filter;

        this.filteredUsers.next( 
            this.organizationUsersData.filter( (user: UserGridModel) => {
                var usernameMatches = user.username.toLowerCase().indexOf(filter.toLowerCase()) > -1;
                var nameMatches = (user.firstName + user.lastName).toLowerCase().indexOf(filter.toLowerCase()) > -1;
               
                var rolesMatch = this.rolesMatch(user);

                return (usernameMatches || nameMatches ) && rolesMatch;
        }));
    }

    public pageChanged(event: IPageChangeEvent): void {
        this.currentPage = event.page;

        this.filterUsers(this.currentFilter);
    }
        
    private updatePageOfData(filteredUsers: UserGridModel[]) {
        if (filteredUsers.length === 0) {
            this.usersDataPage = [];
            return;
        }

        var start = (this.currentPage - 1) * this.pageSize;
        var end = this.currentPage * this.pageSize;

        var sortedData = filteredUsers.sort( ( a, b ) => {
            if (a.username.toLowerCase() < b.username.toLowerCase()) 
                return -1;
            else if (a.username.toLowerCase() > b.username.toLowerCase()) 
                return 1;
            else 
                return 0;
        });

        var pageOfData = sortedData.slice(start, end);

        this.usersDataPage = pageOfData;

        if (this.usersDataPage.length === 0) {
            this.currentPage--;
            this.updatePageOfData(filteredUsers);
        }
    }

    public addUser(){
        this.dialog.open(AddUserComponent, {
            disableClose: true,
            data: {
                organizationId: this.organizationId
            }
        });
    }  

    public editUser(userGridModel: UserGridModel) {
        this.dialog.open(AddUserComponent, {
            disableClose: true,
            data: {
                isEdit: true,
                organizationId: this.organizationId,
                editId: userGridModel.id,
                username: userGridModel.username,
                email: userGridModel.email,
                firstName: userGridModel.firstName,
                lastName: userGridModel.lastName,
                userRole: userGridModel.role,
            }
        });
    }

    public deleteUser(userGridModel: UserGridModel) {
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this user?',
            title: 'Confirm Delete'
          }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);

                this.organizationStore.deleteUser(userGridModel.id)
                    .subscribe(result => {
                        this.toggleShowLoading(false);                        
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete User'
                        });
                    });
            }
          });
    }

    private rolesMatch(userGridModel: UserGridModel) {
        if(this.roleSortKey === this.userRoles[0].value)
            return true;
    
        return userGridModel.role === this.roleSortKey;
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('organizationUsersShowLoading');
        } 
        else {
            this.loadingService.resolve('organizationUsersShowLoading');
        }
    }
}