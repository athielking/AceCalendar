import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { StorageKeys } from '../calendar/common/calendar-tools';
import { CalendarModel } from '../../models/calendar/calendar.model';

@Component({
    selector: 'ac-calendar-selector',
    templateUrl: './calendar-selector.component.html'
})
export class CalendarSelectorComponent implements OnInit{
    
    public calendars: CalendarModel[] = [];
    public selectedCalendar: CalendarModel;

    constructor(private storageService: StorageService){
    }

    ngOnInit(){
        
        if(this.storageService.hasItem(StorageKeys.userCalendars))
        {
            this.calendars = JSON.parse(this.storageService.getItem(StorageKeys.userCalendars))
        
            var id = this.storageService.getItem(StorageKeys.selectedCalendar);
            
            if( this.calendars.findIndex(c => c.id == id) > -1)
                this.selectedCalendar = this.calendars.find( c => c.id == id);
            else if( this.calendars.length > 0 )    
                this.selectedCalendar = this.calendars[0];
                

            if(this.selectedCalendar)
                this.storageService.setItem(StorageKeys.selectedCalendar, this.selectedCalendar.id);
        }

        this.storageService.watchStorage().subscribe( key => {
            if( key == StorageKeys.userCalendars ) {
                this.calendars = JSON.parse(this.storageService.getItem(key));   
                
                if(!this.selectedCalendar && this.calendars.length > 0 )
                {
                    this.selectedCalendar = this.calendars[0];
                    this.storageService.setItem(StorageKeys.selectedCalendar, this.selectedCalendar.id);
                }
            }
            
            if( key == StorageKeys.selectedCalendar )
                this.selectedCalendar = this.calendars.find( c => c.id == this.storageService.getItem(key))
        })

    }

    selectCalendar(calendar: CalendarModel){
        this.selectedCalendar = calendar;
        this.storageService.setItem(StorageKeys.selectedCalendar, calendar.id);
    }
}
