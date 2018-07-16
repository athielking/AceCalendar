import {Component, Input, OnInit, AfterViewInit} from '@angular/core';
import { OrganizationStore } from '../../../stores/organization.store';
import { UserGridModel } from '../../../models/admin/userGridModel';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CalendarStore } from '../../../stores/calendar.store';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CalendarRecordSelectUsersComponent } from './calendar-record-select-users.component';

@Component({
    selector: 'ac-calendar-record-users',
    templateUrl: './calendar-record-users.component.html'
})
export class CalendarRecordUsersComponent implements OnInit {

    private organizationId: string;
    private calendarId: string;

    public selectableUsers: Observable<UserGridModel[]>;
    public selectedUsers: Observable<UserGridModel[]>;

    public showErrorMessage: boolean;
    public errorMessage: string;
    public hasUsers: boolean = false;
    public loadingServiceStr: string;

    @Input() userType: string;

    constructor(private organizationStore: OrganizationStore,
                private calendarStore: CalendarStore,
                private authService: AuthService,
                private loadingService: TdLoadingService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private dialogService: TdDialogService){
    }

    ngOnInit(){
        if(this.userType != 'editing' && this.userType != 'readonly')   
            throw new Error('Unknown User Type');

        this.loadingServiceStr = `${this.userType}_calendarUsersShowLoading`;
        
        this.organizationId = this.authService.getOrganizationId();        
        this.organizationStore.hasError.subscribe( error => {
            this.showErrorMessage = error;
            this.errorMessage = this.organizationStore.errorMessage;
        })

        this.calendarStore.calendarUsers.subscribe();

        this.selectedUsers = this.organizationStore.organizationUsersData.combineLatest( this.calendarStore.calendarUsers, 
            (users, calendarUsers) => {
                if( this.userType == 'editing')
                    users = users.filter( u => u.role == 'Admin' || u.role == 'Organization Admin' || u.role == 'User');
                else if( this.userType == 'readonly')
                    users = users.filter( u => u.role == 'Readonly');
                var selected = [];

                users.forEach( u => {
                    if(calendarUsers.findIndex( cu => cu.userId == u.id ) > -1 )
                        selected.push( u );
                });

                return selected;
            });

        this.selectableUsers = this.organizationStore.organizationUsersData.combineLatest( this.calendarStore.calendarUsers, 
            (users, calendarUsers) => {
                if( this.userType == 'editing')
                    users = users.filter( u => u.role == 'Admin' || u.role == 'Organization Admin' || u.role == 'User');
                else if( this.userType == 'readonly')
                    users = users.filter( u => u.role == 'Readonly');
                var selectable = [];

                users.forEach( u => {
                    if(calendarUsers.findIndex( cu => cu.userId == u.id ) == -1 )
                        selectable.push( u );
                });

                return selectable;
            });    

        this.toggleShowLoading(true);
        this.organizationStore.getOrganizationUsersData(this.organizationId).subscribe( result => {}, error => {}, 
            () => {
                this.toggleShowLoading(false);
            });
        
        this.route.paramMap.subscribe( (params: ParamMap) => {
            this.calendarId = params.get('id');
            this.calendarStore.getCalendarUsers(this.calendarId);
        });
    }

    public addCalendarUser(){
        this.dialog.open( CalendarRecordSelectUsersComponent, {
            data: {
                userType: this.userType,
                organizationId: this.organizationId,
                calendarId: this.calendarId
            },
            width: "400px"
        });
    }

    public onDeleteCalendarUser(user: UserGridModel){
        this.dialogService.openConfirm({
            message: `Are you sure you wish to remove access to this calendar for ${user.username}`,
            title: "Remove Calendar User"
        }).afterClosed().subscribe( result => {
            if(result)
                this.calendarStore.deleteUserFromCalendar(this.calendarId, user.id);
        });
        
    }

    private toggleShowLoading(show:boolean) {
		if (show) {
			this.loadingService.register(this.loadingServiceStr);
		} 
		else {
			this.loadingService.resolve(this.loadingServiceStr);
		}
	}
}
