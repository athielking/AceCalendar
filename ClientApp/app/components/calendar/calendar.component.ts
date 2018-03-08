import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MonthViewComponent } from '../calendar/month/month-view.component'
import { StorageKeys } from './common/calendar-tools';
import { equalSegments } from '@angular/router/src/url_tree';
import { MatTabChangeEvent } from '@angular/material';
import { WeekViewComponent } from './week/week-view.component';
import { WeekViewReadonlyComponent } from './week/readonly/week-view-readonly.component';
import { CalendarViews } from '../calendar/common/models';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'ac-calendar',
    templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
    @ViewChild(WeekViewComponent) weekView: WeekViewComponent;
    @ViewChild(MonthViewComponent) monthView: MonthViewComponent;
    @ViewChild(WeekViewReadonlyComponent) weekViewReadonly: WeekViewReadonlyComponent;
    
    public viewDate : Date;
    
    public selectedIndex: number = 0;

    constructor(private authService: AuthService){

    }

    public onChangeViewDate( newDate: Date ){
        this.viewDate = newDate;
        this.storeViewDate();
    }

    public onChangeSelectedView( newView: CalendarViews ){
        this.selectedIndex = newView;
    }
    
    public ngOnInit(){
        if(localStorage.getItem(StorageKeys.viewDate))
            this.viewDate = new Date(localStorage.getItem(StorageKeys.viewDate));
        else
            this.viewDate = new Date();

        if(localStorage.getItem(StorageKeys.selectedTab))
            this.selectedIndex = +localStorage.getItem(StorageKeys.selectedTab);
        else
            this.selectedIndex = 1;

        this.storeViewDate();
        this.updateCurrentTab();
    }

    public onSelectedTabChange(event: MatTabChangeEvent){
        this.updateCurrentTab();
    }

    private updateCurrentTab(){
        switch(this.selectedIndex) {
            case 0: {
                this.monthView.updateViewDate(this.viewDate);
                break;
            } 
            case 1: {
                this.weekView.updateViewDate(this.viewDate);
                break;
            }
            case 2: {
                this.weekViewReadonly.updateViewDate(this.viewDate);
                break;
            }
        }

        this.storeSelectedTab();
    }

    private storeViewDate(){
        localStorage.setItem(StorageKeys.viewDate, this.viewDate.toDateString());
    }

    private storeSelectedTab(){
        localStorage.setItem(StorageKeys.selectedTab, this.selectedIndex.toString());
    }
}
