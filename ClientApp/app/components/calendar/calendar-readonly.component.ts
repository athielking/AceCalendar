import { Component, OnInit, ViewChild } from '@angular/core'
import { StorageKeys } from './common/calendar-tools';
import { MatTabChangeEvent } from '@angular/material';
import { WeekViewReadonlyComponent } from './week/readonly/week-view-readonly.component';
import { WeekViewPhoneComponent } from './week/readonly/week-view-phone.component';

@Component({
    selector: 'ac-calendar-readonly',
    templateUrl: './calendar-readonly.component.html'
})
export class CalendarReadonlyComponent implements OnInit {
    @ViewChild(WeekViewReadonlyComponent) weekViewReadonly: WeekViewReadonlyComponent;
    @ViewChild(WeekViewPhoneComponent) weekViewPhone: WeekViewPhoneComponent;

    public viewDate : Date;
    
    public selectedIndex: number = 0;
    public isMobile: Boolean = false;
    
    constructor(){
        if(window.screen.width <= 576)
            this.isMobile = true;
    }

    public onChangeViewDate( newDate: Date ){
        this.viewDate = newDate;
        this.storeViewDate();
    }
    
    public ngAfterViewInit(){
        this.updateCurrentTab();
    }

    public ngOnInit(){
        if(localStorage.getItem(StorageKeys.readonlyViewDate))
            this.viewDate = new Date(localStorage.getItem(StorageKeys.readonlyViewDate));
        else
            this.viewDate = new Date();

        // if(localStorage.getItem(StorageKeys.readonlySelectedTab))
        //     this.selectedIndex = +localStorage.getItem(StorageKeys.readonlySelectedTab);
        // else
        //     this.selectedIndex = 0;

        this.storeViewDate();        
    }

    public onSelectedTabChange(event: MatTabChangeEvent){
        this.updateCurrentTab();
    }

    private updateCurrentTab(){
        
        if(!this.isMobile)
        {
            switch(this.selectedIndex) {
                case 0: {
                    this.weekViewReadonly.updateViewDate(this.viewDate);
                    break;
                }
            }

            this.storeSelectedTab();
        }
        else
            this.weekViewPhone.updateViewDate(this.viewDate);
    }

    private storeViewDate(){
        localStorage.setItem(StorageKeys.readonlyViewDate, this.viewDate.toDateString());
    }

    private storeSelectedTab(){
        localStorage.setItem(StorageKeys.readonlySelectedTab, this.selectedIndex.toString());
    }
}
