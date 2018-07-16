import {Component, Input, OnInit, AfterViewInit, Inject} from '@angular/core';
import { OrganizationStore } from '../../../stores/organization.store';
import { UserGridModel } from '../../../models/admin/userGridModel';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CalendarStore } from '../../../stores/calendar.store';
import { TdLoadingService } from '@covalent/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatCheckboxChange, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'ac-calendar-record-select-users',
    templateUrl: './calendar-record-select-users.component.html'
})
export class CalendarRecordSelectUsersComponent implements OnInit {

    private organizationId: string;
    private calendarId: string;

    private selected: string[] = [];
    private userType: string;

    public selectableUsers: Observable<UserGridModel[]>;        
    public showErrorMessage: boolean;
    public errorMessage: string;

    constructor(private organizationStore: OrganizationStore,
                private calendarStore: CalendarStore,
                private loadingService: TdLoadingService,
                private dialogRef: MatDialogRef<CalendarRecordSelectUsersComponent>,
                @Inject(MAT_DIALOG_DATA) private data){
                    this.userType = data.userType;
                    this.calendarId = data.calendarId;
                    this.organizationId = data.organizationId;
    }

    ngOnInit(){
       
        this.organizationStore.hasError.subscribe( error => {
            this.showErrorMessage = error;
            this.errorMessage = this.organizationStore.errorMessage;
        })

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
        this.calendarStore.getCalendarUsers(this.calendarId);
    }

    public checkboxChanged(event: MatCheckboxChange){
        this.selected.push(event.source.id);
    }

    private toggleShowLoading(show:boolean) {
		if (show) {
			this.loadingService.register('calendarSelectUsersShowLoading');
		} 
		else {
			this.loadingService.resolve("calendarSelectUsersShowLoading");
		}
    }
    
    public onOkClick(){
        this.calendarStore.assignUsersToCalendar(this.calendarId, this.selected).subscribe( result => {
            this.dialogRef.close(true);
        });
    }

    public onCancelClick(){
        this.dialogRef.close(false);
    }
}
