import { Component, OnInit } from '@angular/core';
import { CalendarModel } from '../../../models/calendar/calendar.model';
import { CalendarStore } from '../../../stores/calendar.store';
import { BehaviorSubject } from 'rxjs';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { OrganizationStore } from '../../../stores/organization.store';

@Component({
  selector: 'ac-calendar-record',
  templateUrl: './calendar-record-list.component.html'
})
export class CalendarRecordListComponent implements OnInit {

	private calendars: CalendarModel[];
	private hasCalendars: Boolean = false;
	private organizationId: string;

	public filteredCalendars: BehaviorSubject<CalendarModel[]> = new BehaviorSubject([]);
	public hasFilteredCalendars: Boolean = false;

	public currentFilter: String;
	public showErrorMessage: boolean;
	public errorMessage: string;
	
	public activeCalendars: number = 0;
	public calendarLicenses: number = 0;
	public showSubscriptionInformation: boolean;

	constructor(
		private calendarStore: CalendarStore,
		private loadingService: TdLoadingService,
		private dialogService: TdDialogService,
		private authService: AuthService,
		private organizationStore: OrganizationStore
	) { 		
	}

  	ngOnInit() {

		this.organizationId = this.authService.getOrganizationId();
				
		this.organizationStore.getSubscriptionLicenseDetails(this.organizationId).subscribe( subscriptionLicenseDetailsViewModel => {
			this.calendarLicenses = subscriptionLicenseDetailsViewModel.calendars;
			this.showSubscriptionInformation = true;
		}, error => {
			this.showErrorMessage = true;
			this.errorMessage = "Unable to get subscription license details."
		});           

		this.calendarStore.calendars.subscribe( result => {
			this.calendars = result;
			this.hasCalendars = this.calendars.length > 0;
			this.filterCalendars();
			this.activeCalendars = result.filter(calendar => calendar.inactive === false).length;
		});

		this.filteredCalendars.subscribe( records => {
            this.hasFilteredCalendars = records.length > 0;
        });

        this.calendarStore.isLoading.subscribe( result => {
            this.toggleShowLoading(result); 
        });

        this.calendarStore.hasError.subscribe( result => {
            this.showErrorMessage = result;
        });
		
		this.calendarStore.errorMessage.subscribe( result => {
			this.errorMessage = result;
		})

		this.calendarStore.getCalendarsForOrganization();
  	}

	private toggleShowLoading(show:boolean) {
		if (show) {
			this.loadingService.register('showCalendarsLoading');
		} 
		else {
			this.loadingService.resolve('showCalendarsLoading');
		}
	}

	public removeFilter(){
        this.filterCalendars();
	}
	
	public filterCalendars(filter: string = '') {    
        this.currentFilter = filter;

        this.filteredCalendars.next( 
            this.calendars.filter( (calendar: CalendarModel) => {
                return (calendar.calendarName).toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }));
	}
	
	public addCalendar(){
		if(this.activeCalendars >= this.calendarLicenses) {
			this.dialogService.openAlert({
				message: "You have reached the maximum allowed calendars for your subscription. To add an additional calendar, please inactivate an existing calendar or upgrade your subscription.",
				title: 'Unable to Add Calendar'
			});
		}
		else {
			var ref = this.dialogService.openPrompt({
				message: "Calendar Name",
				title: "Add Calendar"
			});
	
			ref.beforeClose().subscribe( result => {
				if(!result)
					return;
				
				this.calendarStore.addCalendarRecord(this.organizationId, ref.componentInstance.value);
			})
		}
	}
	
	public activateCalendar(calendarId: string) {
		if(this.activeCalendars >= this.calendarLicenses) {
			this.dialogService.openAlert({
				message: "You have reached the maximum allowed calendars for your subscription. To add an additional calendar, please inactivate an existing calendar or upgrade your subscription.",
				title: 'Unable to Add Calendar'
			});
		}
		else {
			this.dialogService.openConfirm({
				message: 'Are you sure you wish to activate this calendar?',
				title: 'Confirm Activate'
			  }).afterClosed().subscribe((accept: boolean) => {
				if (accept) {
					this.toggleShowLoading(true);
	
					this.calendarStore.activateCalendarRecord(this.organizationId, calendarId)
						.subscribe(result => {
							this.toggleShowLoading(false);                        
						}, error => {
							this.toggleShowLoading(false);
							this.dialogService.openAlert({
								message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
								title: 'Unable to Activate Calendar'
							});
						});
				}
			});
		}
	}

	public inactivateCalendar(calendarId: string) {
		this.dialogService.openConfirm({
            message: 'Are you sure you wish to inactivate this calendar?',
            title: 'Confirm Inactivate'
          }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);

                this.calendarStore.inactivateCalendarRecord(this.organizationId, calendarId)
                    .subscribe(result => {
                        this.toggleShowLoading(false);                        
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Inactivate Calendar'
                        });
                    });
            }
          });
	}
}
