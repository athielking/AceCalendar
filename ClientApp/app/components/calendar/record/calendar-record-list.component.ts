import { Component, OnInit } from '@angular/core';
import { CalendarModel } from '../../../models/calendar/calendar.model';
import { CalendarStore } from '../../../stores/calendar.store';
import { BehaviorSubject } from 'rxjs';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';

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
	
	constructor(private calendarStore: CalendarStore,
				private loadingService: TdLoadingService,
				private dialogService: TdDialogService,
				private authService: AuthService) { }

  	ngOnInit() {

		this.organizationId = this.authService.getOrganizationId();
		
		this.calendarStore.calendars.subscribe( result => {
			this.calendars = result;
			this.hasCalendars = this.calendars.length > 0;
			this.filterCalendars();
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

	public editCalendar(calendar: CalendarModel){}
	public deleteCalendar(id: string){
        
        var ref = this.dialogService.openConfirm({
            message: "Are you sure you wish to delete this calendar?",
            title: "Confirm Delete"
        });

        ref.beforeClose().subscribe( result => {
            if(!result)
                return;

            this.calendarStore.deleteCalendarRecord(id);
        });

    }
}
