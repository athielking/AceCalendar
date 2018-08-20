import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { MonthViewComponent } from './month/month-view.component'
import { StorageKeys } from './common/calendar-tools';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { WeekViewComponent } from './week/week-view.component';
import { CalendarViews } from './common/models';
import { AuthService } from '../../services/auth.service';
import { CalendarFilterComponent } from './common/calendar-filter.component';
import { StorageService } from '../../services/storage.service';
import { Subscription } from 'rxjs';
import { TagFilter } from '../../models/shared/filter.model';

@Component({
    selector: 'ac-calendar',
    templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, OnDestroy {
    @ViewChild(WeekViewComponent) weekView: WeekViewComponent;
    @ViewChild(MonthViewComponent) monthView: MonthViewComponent;
    
    public viewDate : Date;
    public selectedIndex: number = 0;
    public filterEnabled: boolean = false;

    private isMobile: Boolean = false;
    private storageSub: Subscription;
    private jobFilter: TagFilter = new TagFilter();
    private workerFilter: TagFilter = new TagFilter();

    constructor(private authService: AuthService,
                private storageService: StorageService,
                private dialog: MatDialog){

        if(window.screen.width <= 576)
            this.isMobile = true;

    }

    public ngOnInit(){

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

    public showFilter(){
        this.dialog.open(CalendarFilterComponent);
    }

    public clearFilter() {

        this.jobFilter.enabled = false;
        this.workerFilter.enabled = false;

        this.storageService.setItem(StorageKeys.jobFilter, JSON.stringify(this.jobFilter));
        this.storageService.setItem(StorageKeys.workerFilter, JSON.stringify(this.workerFilter));
    }

    public onChangeSelectedView( newView: CalendarViews ){
        this.selectedIndex = newView;
    }

    private handleStorageChange(key: string){
        
        if(key == StorageKeys.jobFilter) 
            this.jobFilter.fromJSON(this.storageService.getItem(StorageKeys.jobFilter));

        if(key == StorageKeys.workerFilter )
            this.workerFilter.fromJSON(this.storageService.getItem(StorageKeys.workerFilter));
            
        this.filterEnabled = this.workerFilter.enabled || this.jobFilter.enabled;

        if(key == StorageKeys.selectedTab)
            this.selectedIndex = +this.storageService.getItem(key);
        
        if(key == StorageKeys.viewDate)
            this.viewDate = new Date(this.storageService.getItem(key));
    }
}
