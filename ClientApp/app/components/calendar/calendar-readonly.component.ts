import { Component, OnInit, ViewChild } from '@angular/core'
import { StorageKeys } from './common/calendar-tools';
import { MatTabChangeEvent } from '@angular/material';
import { WeekViewReadonlyComponent } from './week/readonly/week-view-readonly.component';

@Component({
    selector: 'ac-calendar-readonly',
    templateUrl: './calendar-readonly.component.html'
})
export class CalendarReadonlyComponent implements OnInit {
    @ViewChild(WeekViewReadonlyComponent) weekViewReadonly: WeekViewReadonlyComponent;
    
    public viewDate : Date;
    
    public selectedIndex: number = 0;

    public onChangeViewDate( newDate: Date ){
        this.viewDate = newDate;
        this.storeViewDate();
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
        this.updateCurrentTab();
    }

    public onSelectedTabChange(event: MatTabChangeEvent){
        this.updateCurrentTab();
    }

    private updateCurrentTab(){
        
        switch(this.selectedIndex) {
            case 0: {
                this.weekViewReadonly.updateViewDate(this.viewDate);
                break;
            }
        }

        this.storeSelectedTab();
    }

    private storeViewDate(){
        localStorage.setItem(StorageKeys.readonlyViewDate, this.viewDate.toDateString());
    }

    private storeSelectedTab(){
        localStorage.setItem(StorageKeys.readonlySelectedTab, this.selectedIndex.toString());
    }
}
