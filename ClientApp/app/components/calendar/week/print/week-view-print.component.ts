import {Component, Input, AfterContentInit, ComponentFactoryResolver, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as start_of_week from 'date-fns/start_of_week';
import * as end_of_week from 'date-fns/end_of_week';

import {WeekViewComponent} from '../week-view.component';
import { CalendarStore } from '../../../../stores/calendar.store';
import { JobStore } from '../../../../stores/job.store';
import { StorageService } from '../../../../services/storage.service';
import { DayView } from '../../common/models';

@Component({
    selector: "ac-week-print",
    templateUrl: './week-view-print.component.html',
    styleUrls: ['./week-view-print.component.scss']
})
export class WeekViewPrintComponent implements OnInit, OnChanges {
    @Input() viewDate: Date;

    startOfWeek: Date;
    endOfWeek: Date;
    isLoading: boolean;
    weekData: DayView[];
    constructor(
        public calendarStore: CalendarStore ) {
        }
    
        public ngOnInit() {

            this.startOfWeek = start_of_week(this.viewDate);
            this.endOfWeek = end_of_week(this.viewDate);
    
            this.calendarStore.isWeekLoading.subscribe( result => {
                this.isLoading = result;
            });
    
            this.calendarStore.weekData.subscribe( result => {
                this.weekData = result;     
            });
        }
    
        public ngOnChanges( changes: SimpleChanges ){
            if( changes.viewDate )
            {
                this.startOfWeek = start_of_week(this.viewDate);
                this.endOfWeek = end_of_week(this.viewDate);
            }
        }
}