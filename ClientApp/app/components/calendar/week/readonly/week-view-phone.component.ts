import { Component, Input, OnInit } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MatDialog, MatSelectChange } from '@angular/material';
import * as add_days from 'date-fns/add_days';

import { DayView, Worker} from '../../common/models'
import { StorageKeys } from '../../common/calendar-tools'
import { CalendarStore } from '../../../../stores/calendar.store'
import { WorkerStore } from '../../../../stores/worker.store'
import { StorageService } from '../../../../services/storage.service';


@Component({
    selector: 'ac-week-view-phone',
    templateUrl: './week-view-phone.component.html',
    styleUrls: ['./week-view-phone.component.scss',
                '../../common/calendar-card.scss'],
    animations: [
        trigger('expandCollapse', [
            state('expandCollapseState', style({height: '*'})),
            transition('* => void', [style({height: '*'}), animate(200, style({height: '0'}))]),
            transition('void => *', [style({height: '0'}), animate(200, style({height: "*"}))])
        ])
    ]
})
export class WeekViewPhoneComponent implements OnInit {
    @Input() viewDate: Date;

    public isLoading: boolean = false;
    public showJobOption: string = null;
    public showingOptions: boolean = false;
    public calendarSelected: boolean = false;

    private allWorkers: Worker = new Worker('', "All Workers", null, null, null, []);

    public workers: Worker[] = [];

    protected weekData: DayView[];
    public startOfWeek: Date;
    public endOfWeek: Date;
    public showErrorMessage: boolean;
    public errorMessage: string;

    constructor(
        private storageService: StorageService,
        private calendarStore: CalendarStore,
        private workerStore: WorkerStore ) {

            this.viewDate = new Date();
            this.startOfWeek = this.viewDate;
            this.endOfWeek = add_days(this.viewDate, 7);
            
    }
    
    public showJobOptionChange(event:  MatSelectChange){
        this.storageService.setItem(StorageKeys.showJobOption, event.value);
    }

    public workerCompare(o1, o2){
        if(o2 == null && o1 == "")
            return true;

        return o1 === o2;
    }

    public ngOnInit(){

        //this.calendarSelected = this.storageService.hasItem(StorageKeys.selectedCalendar);   

        if( this.storageService.hasItem(StorageKeys.showJobOption ))
            this.showJobOption = this.storageService.getItem(StorageKeys.showJobOption);

        this.calendarStore.isWeekLoading.subscribe( result => {
            this.isLoading = result;
        });

        this.calendarStore.phoneWeekData.subscribe( result => {
            this.weekData = result;     
        });

        this.workerStore.workers.subscribe( result => {
            this.workers =  [this.allWorkers].concat(result);
        });

        this.storageService.watchStorage().subscribe( key => {
            if( key == StorageKeys.showJobOption )
            {
                this.showJobOption = this.storageService.getItem(key);
                this.calendarStore.getPhoneDataForWeek(this.showJobOption);
            }

            if(key == StorageKeys.selectedCalendar){
                this.calendarSelected = this.storageService.hasItem(StorageKeys.selectedCalendar);

                if(this.calendarSelected)
                    this.calendarStore.getPhoneDataForWeek(this.showJobOption);
            }
        });

        if(this.calendarSelected)
            this.calendarStore.getPhoneDataForWeek(this.showJobOption);

        this.workerStore.getWorkers();
    }

    protected toggleJobFilterOptions(){
        this.showingOptions = !this.showingOptions;
    }
}