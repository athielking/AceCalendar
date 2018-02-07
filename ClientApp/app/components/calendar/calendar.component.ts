import { Component, Input, OnInit } from '@angular/core'
import { MonthViewComponent } from '../calendar/month/month-view.component'
import { StorageKeys } from './common/calendar-tools';
import { equalSegments } from '@angular/router/src/url_tree';
import { MatTabChangeEvent } from '@angular/material';


@Component({
    selector: 'ac-calendar',
    templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
    viewDate : Date;
    selectedIndex: number = 0;

    onChangeViewDate( newDate: Date ){
        this.viewDate = newDate;
        this.storeViewDate();
    }
    
    ngOnInit(){
        if(localStorage.getItem(StorageKeys.viewDate))
            this.viewDate = new Date(localStorage.getItem(StorageKeys.viewDate));
        else
            this.viewDate = new Date();

        if(localStorage.getItem(StorageKeys.selectedTab))
            this.selectedIndex = +localStorage.getItem(StorageKeys.selectedTab);

        this.storeViewDate();
        this.storeSelectedTab();
    }

    onSelectedTabChange(event: MatTabChangeEvent){
        //localStorage.setItem(StorageKeys.selectedTab, event.index.toString());
        this.storeSelectedTab();
    }

    storeViewDate(){
        localStorage.setItem(StorageKeys.viewDate, this.viewDate.toDateString());
    }

    storeSelectedTab(){
        localStorage.setItem(StorageKeys.selectedTab, this.selectedIndex.toString());
    }

}
