import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core'
import {DatePipe} from '@angular/common';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import * as isSameWeek from 'date-fns/is_same_week'
import * as isSameDay from 'date-fns/is_same_day';
import * as add_weeks from 'date-fns/add_weeks';
import * as start_of_week from 'date-fns/start_of_week';
import * as end_of_week from 'date-fns/end_of_week';

import { CalendarDay, DayView } from '../../../calendar/common/models'
import { CalendarStore } from '../../../../stores/calendar.store'
import { JobStore } from '../../../../stores/job.store'
import { WeekViewComponent } from '../week-view.component';
import { StorageService } from '../../../../services/storage.service';

@Component({
    selector: 'ac-week-view-readonly',
    templateUrl: './week-view-readonly.component.html',
    styleUrls: ['../week-view.component.scss'],
    providers:[DatePipe]
})
export class WeekViewReadonlyComponent extends WeekViewComponent {

    constructor(
        dialog: MatDialog,
        storageService: StorageService,
        calendarStore: CalendarStore,
        jobStore: JobStore,
        loadingService: TdLoadingService,
        dialogService: TdDialogService,
        datePipe: DatePipe ) {
            super(calendarStore, jobStore, storageService, loadingService, dialogService, dialog, datePipe);
    }
}