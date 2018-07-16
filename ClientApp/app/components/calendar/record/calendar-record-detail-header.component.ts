import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CalendarStore } from '../../../stores/calendar.store';
import { CalendarModel } from '../../../models/calendar/calendar.model';
import { TdLoadingService } from '@covalent/core';
import { TdDialogService } from '@covalent/core';

@Component({
    selector: 'ac-calendar-record-header',
    templateUrl: './calendar-record-detail-header.component.html'
})
export class CalendarRecordDetailHeaderComponent implements OnInit{

    private calendarId: string;
    
    public calendarName: string = '';

    public showErrorMessage: boolean;
    public errorMessage: string;

    constructor(public route: ActivatedRoute,
                public calendarStore: CalendarStore,
                public loadingService: TdLoadingService,
                private dialogService: TdDialogService){
    }

    ngOnInit(){

        this.toggleShowLoading(true);

        this.calendarStore.hasError.subscribe( error => {
            this.showErrorMessage = error;
        })

        this.calendarStore.errorMessage.subscribe( message => {
            this.errorMessage = message;
        })

        this.calendarStore.calendar.subscribe(calendar => {
            if(!calendar)
                return;
                
            this.calendarName = calendar.calendarName;
              
            this.toggleShowLoading(false);           
        });
        
        this.route.paramMap.subscribe( (params: ParamMap) => {
            this.calendarId = params.get('id');
            this.calendarStore.getCalendarRecord(this.calendarId);
        });
    }

    public editCalendar() {
        var ref = this.dialogService.openPrompt({
			message: "Calendar Name",
            title: "Edit Calendar",
            value: this.calendarName
		});

		ref.beforeClose().subscribe( result => {
			if(!result)
				return;
			
			this.calendarStore.editCalendarRecord(this.calendarId, ref.componentInstance.value);
        })
    }

    private toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('calendarDetailHeaderShowLoading');
        } 
        else {
            this.loadingService.resolve('calendarDetailHeaderShowLoading');
        }
    }
}