import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { MatSelectChange, MatDialog, MatDatepickerInputEvent } from '@angular/material';

import { StorageService } from '../../services/storage.service';
import { StorageKeys } from '../calendar/common/calendar-tools';
import { TagFilter } from '../../models/shared/filter.model';
import { CalendarFilterComponent } from '../calendar/common/calendar-filter.component';

import * as add_weeks from 'date-fns/add_weeks';
import * as start_of_week from 'date-fns/start_of_week';
import * as add_months from 'date-fns/add_months';
import * as start_of_month from 'date-fns/start_of_month';
import { CalendarViews } from '../calendar/common/models';
import { MonthDisplayOptionsComponent } from '../calendar/month/month-displayOptions.component';
import { AddWorkerOption } from '../../models/shared/calendar-options';

@Component({
    selector: 'ac-calendar-toolbar',
    templateUrl: './calendar-toolbar.component.html'
})
export class CalendarToolbarComponent implements OnInit{

    @Input() viewDate: Date;
    @Input() disabled: boolean = false;

    public viewOption: number = 0;
    public filterEnabled: boolean = false;
    public workerAddOption: AddWorkerOption;

    public isWeekView: boolean = false;
    public isMonthView: boolean = false;

    private jobFilter: TagFilter = new TagFilter();
    private workerFilter: TagFilter = new TagFilter();
    
    constructor(private storageService: StorageService,
                private dialog: MatDialog){
    }

    ngOnInit(){
        this.workerAddOption = +this.storageService.getItem(StorageKeys.addWorkerOption)
        this.storageService.watchStorage().subscribe(key => this.handleStorageChange(key));

        this.viewDate = new Date(this.storageService.getItem(StorageKeys.viewDate));
        this.viewOption = +this.storageService.getItem(StorageKeys.selectedTab);

        this.isWeekView = this.viewOption == CalendarViews.WeekView;
        this.isMonthView = this.viewOption == CalendarViews.MonthView;

        if(this.storageService.hasItem(StorageKeys.jobFilter))
            this.jobFilter.fromJSON(this.storageService.getItem(StorageKeys.jobFilter));

		if(this.storageService.hasItem(StorageKeys.workerFilter))
            this.workerFilter.fromJSON(this.storageService.getItem(StorageKeys.workerFilter));
        
        this.filterEnabled = this.workerFilter.enabled || this.jobFilter.enabled;
    }

    public todayClick(){
        this.viewDate = new Date();
        this.storageService.setItem(StorageKeys.viewDate, this.viewDate);
    }

    public viewDateChange(event: MatDatepickerInputEvent<Date>){
        this.viewDate = event.value;
        this.storageService.setItem(StorageKeys.viewDate, this.viewDate);
    }

    public viewDateBack(){
        if(this.viewOption == CalendarViews.WeekView)
            this.viewDate = add_weeks(this.viewDate, -1);
        else if( this.viewOption == CalendarViews.MonthView)
            this.viewDate = add_months(this.viewDate, -1);
        
        this.storageService.setItem(StorageKeys.viewDate, this.viewDate);
    }

    public viewDateForward(){
        if(this.viewOption == CalendarViews.WeekView)
            this.viewDate = add_weeks(this.viewDate, 1);
        else if( this.viewOption == CalendarViews.MonthView)
            this.viewDate = add_months(this.viewDate, 1);
        
        this.storageService.setItem(StorageKeys.viewDate, this.viewDate);
    }

    public selectedViewChanged(event: MatSelectChange){
        this.storageService.setItem(StorageKeys.selectedTab, event.value);

        this.isWeekView = this.viewOption == CalendarViews.WeekView;
        this.isMonthView = this.viewOption == CalendarViews.MonthView;
    }

    public getTooltip(forward: boolean){
        var direction = 'Previous';
        if(forward)
            direction = 'Next';

        return this.viewOption == CalendarViews.WeekView ? `${direction} Week` : `${direction} Month`;
    }

    public filterClick(){
        this.dialog.open(CalendarFilterComponent);
    }

    public clearFilter() {

        this.jobFilter.enabled = false;
        this.workerFilter.enabled = false;

        this.storageService.setItem(StorageKeys.jobFilter, JSON.stringify(this.jobFilter));
        this.storageService.setItem(StorageKeys.workerFilter, JSON.stringify(this.workerFilter));
    }

    public printClick(){
        
    }

    public displayOptionsClick(){
        this.dialog.open(MonthDisplayOptionsComponent);
    }

    public viewOptionCompare(o1, o2): boolean{
        return +o1 == +o2;
    }

    public addWorkerOptionCompare(o1, o2): boolean{
        return (<AddWorkerOption>o1) == (<AddWorkerOption>o2);
    }

    private handleStorageChange(key: string){
        
        if(key == StorageKeys.jobFilter) 
            this.jobFilter.fromJSON(this.storageService.getItem(StorageKeys.jobFilter));

        if(key == StorageKeys.workerFilter )
            this.workerFilter.fromJSON(this.storageService.getItem(StorageKeys.workerFilter));
            
        this.filterEnabled = this.workerFilter.enabled || this.jobFilter.enabled;
    }

}