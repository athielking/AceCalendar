import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs/Rx';

import { StorageKeys } from './common/calendar-tools';
import { WeekViewReadonlyComponent } from './week/readonly/week-view-readonly.component';
import { WeekViewPhoneComponent } from './week/readonly/week-view-phone.component';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'ac-calendar-readonly',
    templateUrl: './calendar-readonly.component.html'
})
export class CalendarReadonlyComponent implements OnInit, OnDestroy {
     @ViewChild(WeekViewReadonlyComponent) weekViewReadonly: WeekViewReadonlyComponent;
     @ViewChild(WeekViewPhoneComponent) weekViewPhone: WeekViewPhoneComponent;

    public viewDate : Date;
    
    public selectedIndex: number = 0;
    public isMobile: Boolean = false;
    private storageSub: Subscription;

    constructor(private storageService: StorageService)
    {
    }

    public ngOnInit(){

        if(window.screen.width <= 576)
            this.isMobile = true;

        if(this.storageService.hasItem(StorageKeys.viewDate))
            this.viewDate = new Date(this.storageService.getItem(StorageKeys.viewDate));
        else
            this.viewDate = new Date();

        if(localStorage.getItem(StorageKeys.selectedTab))
            this.selectedIndex = +localStorage.getItem(StorageKeys.selectedTab);
        else
            this.selectedIndex = 1;

        this.storageSub = this.storageService.watchStorage().subscribe( result => this.handleStorageChange(result));
    }

    public ngOnDestroy(){
        this.storageSub.unsubscribe();
    }

    private handleStorageChange(key: string){
    
        if(key == StorageKeys.selectedTab)
            this.selectedIndex = +this.storageService.getItem(key);
        
        if(key == StorageKeys.viewDate)
            this.viewDate = new Date(this.storageService.getItem(key));
    }

}
