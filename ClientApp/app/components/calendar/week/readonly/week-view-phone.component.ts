import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MatDialog, MatSelectChange } from '@angular/material';
import * as isSameWeek from 'date-fns/is_same_week'
import * as isSameDay from 'date-fns/is_same_day';
import * as add_weeks from 'date-fns/add_weeks';
import * as add_days from 'date-fns/add_days';
import * as start_of_week from 'date-fns/start_of_week';
import * as end_of_week from 'date-fns/end_of_week';

import { AddWorkerOption } from '../../../../models/shared/calendar-options';
import { CalendarDay, DayView, Worker} from '../../../calendar/common/models'
import { StorageKeys } from '../../../calendar/common/calendar-tools'
import { CalendarStore } from '../../../../stores/calendar.store'
import { WorkerStore } from '../../../../stores/worker.store'
import { WeekViewComponent } from '../week-view.component';
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

    public showJobOption: string = null;
    public showingOptions: boolean = false;
    private allWorkers: Worker = new Worker('', "All Workers", null, null, null);

    public workers: Worker[] = [];

    protected weekData: DayView[];
    protected viewDate: Date;
    public startOfWeek: Date;
    public endOfWeek: Date;
    public showErrorMessage: boolean;
    public errorMessage: string;

    constructor(
        private dialog: MatDialog,
        private storageService: StorageService,
        private calendarStore: CalendarStore,
        private workerStore: WorkerStore,
        private loadingService: TdLoadingService,
        private dialogService: TdDialogService ) {

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
        if( this.storageService.hasItem(StorageKeys.showJobOption ))
            this.showJobOption = this.storageService.getItem(StorageKeys.showJobOption);

        this.calendarStore.isWeekLoading.subscribe( result => {
            this.toggleShowLoading(result); 
        });

        this.calendarStore.phoneWeekData.subscribe( result => {
            this.weekData = result;     
        });

        this.workerStore.workers.subscribe( result => {
            this.workers =  [this.allWorkers].concat(result.toArray());
        });

        this.storageService.watchStorage().subscribe( key => {
            if( key == StorageKeys.showJobOption )
            {
                this.showJobOption = this.storageService.getItem(key);
                this.calendarStore.getPhoneDataForWeek(this.showJobOption);
            }
        });

        this.calendarStore.getPhoneDataForWeek(this.showJobOption);
        this.workerStore.getWorkers();
    }

    protected toggleJobFilterOptions(){
        this.showingOptions = !this.showingOptions;
    }

    protected toggleShowLoading(show:boolean) {
        if (show) {
            this.loadingService.register('showWeekViewPhoneLoading');
        } 
        else {
            this.loadingService.resolve('showWeekViewPhoneLoading');
        }
    }
}