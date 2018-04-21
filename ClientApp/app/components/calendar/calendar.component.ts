import { Component, OnInit, ViewChild } from '@angular/core'
import { MonthViewComponent } from '../calendar/month/month-view.component'
import { StorageKeys } from './common/calendar-tools';
import { MatTabChangeEvent } from '@angular/material';
import { WeekViewComponent } from './week/week-view.component';
import { CalendarViews } from '../calendar/common/models';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'ac-calendar',
    templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
    @ViewChild(WeekViewComponent) weekView: WeekViewComponent;
    @ViewChild(MonthViewComponent) monthView: MonthViewComponent;
    
    public viewDate : Date;
    public selectedIndex: number = 0;

    private isMobile: Boolean = false;

    constructor(private authService: AuthService){

        if(window.screen.width <= 576)
            this.isMobile = true;

        if(localStorage.getItem(StorageKeys.viewDate))
            this.viewDate = new Date(localStorage.getItem(StorageKeys.viewDate));
        else
            this.viewDate = new Date();

        if(localStorage.getItem(StorageKeys.selectedTab))
            this.selectedIndex = +localStorage.getItem(StorageKeys.selectedTab);
        else
            this.selectedIndex = 1;
    }

    public ngOnInit(){
        this.storeViewDate();
    }

    public onChangeViewDate( newDate: Date ){
        this.viewDate = newDate;
        this.storeViewDate();
    }

    public onChangeSelectedView( newView: CalendarViews ){
        this.selectedIndex = newView;
    }

    public onSelectedTabChange(event: MatTabChangeEvent){
        this.storeSelectedTab();
    }

    private storeViewDate(){
        localStorage.setItem(StorageKeys.viewDate, this.viewDate.toDateString());
    }

    private storeSelectedTab(){
        localStorage.setItem(StorageKeys.selectedTab, this.selectedIndex.toString());
    }
}
