import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { MatDialog } from '@angular/material'
import * as startOfWeek from 'date-fns/start_of_week';
import * as addDays from 'date-fns/add_days';

import { CalendarDay, CalendarViews } from '../../calendar/common/models'
import { MonthDisplayOptionsComponent } from './month-displayOptions.component';
import { CalendarStore } from '../../../stores/calendar.store';
import { StorageService } from '../../../services/storage.service';
import { ViewChangeRequest } from '../../../events/calendar.events';
import { MonthViewDateComponent } from './month-view-date.component';
import { StorageKeys } from '../common/calendar-tools';

@Component({
	selector: 'ac-month-view',
	templateUrl: './month-view.component.html',
	styleUrls: ['./month-view.component.scss',
		'../common/calendar-card.scss']
})
export class MonthViewComponent implements OnInit {
	@Input() viewDate: Date;
	@Output() changeViewDate: EventEmitter<Date> = new EventEmitter<Date>();
	@Output() changeSelectedView: EventEmitter<CalendarViews> = new EventEmitter<CalendarViews>();

	@ViewChild(MonthViewDateComponent) monthViewDate: MonthViewDateComponent;

	private isLoading: Boolean = false;
    private header: CalendarDay[];
    
    public calendarSelected: boolean = false;
	public showErrorMessage: boolean;
	public errorMessage: string;

	constructor(
		public calendarStore: CalendarStore,
		private loadingService: TdLoadingService,
		private dialog: MatDialog,
		private storageService: StorageService) {

            this.calendarSelected = this.storageService.hasItem(StorageKeys.selectedCalendar);
	}

	ngOnInit() {
		this.calendarStore.isMonthLoading.subscribe(result => {
			this.isLoading = result;
        });
        
        this.storageService.watchStorage().subscribe( key => {
            if(key == StorageKeys.selectedCalendar)
                this.calendarSelected = this.storageService.hasItem(StorageKeys.selectedCalendar);
        })
	}

	public onChangeViewDate(date: Date) {
		this.handleDateChanged(date);
		this.changeViewDate.emit(date);
	}

	public onChangeView(event: ViewChangeRequest) {
        this.changeViewDate.emit(event.viewDate);
        this.handleDateChanged(event.viewDate);
		this.changeSelectedView.emit(event.view);
	}

	public showDisplayOptions() {
		this.dialog.open(MonthDisplayOptionsComponent);
	}

	private handleDateChanged(date: Date) {

		this.header = this.getWeekHeaderDays( date );
		this.calendarStore.getDataForMonth(date);
	}

	private getWeekHeaderDays(date){
		const start: Date = startOfWeek(this.viewDate);
		const days: CalendarDay[] = [];

		for (let i: number = 0; i < 7; i++) {
			const date: Date = addDays(start, i);
			days.push(new CalendarDay( date, this.viewDate ));
		}

		return days;
	}

}