import { Component } from '@angular/core'
import {DatePipe} from '@angular/common';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';

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