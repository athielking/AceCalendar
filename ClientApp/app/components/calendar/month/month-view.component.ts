import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter, ViewChild } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { MatDialog } from '@angular/material'
import { Observable } from 'rxjs/Rx';

import { getWeekHeaderDays } from '../../calendar/common/calendar-tools'
import { MonthView, CalendarDay, DayView, CalendarViews } from '../../calendar/common/models'
import { MonthDisplayOptionsComponent } from './month-displayOptions.component';
import { CalendarStore } from '../../../stores/calendar.store';
import { StorageService } from '../../../services/storage.service';
import { ViewChangeRequest } from '../../../events/calendar.events';
import { MonthViewDateComponent } from './month-view-date.component';

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

	public showErrorMessage: boolean;
	public errorMessage: string;

	constructor(
		public calendarStore: CalendarStore,
		private loadingService: TdLoadingService,
		private dialog: MatDialog,
		private storageService: StorageService) {
	}

	ngOnInit() {
		this.calendarStore.isMonthLoading.subscribe(result => {
			this.isLoading = result;
		});
	}

	public onChangeViewDate(date: Date) {
		this.handleDateChanged(date);
		this.changeViewDate.emit(date);
	}

	public onChangeView(event: ViewChangeRequest) {
		this.changeViewDate.emit(event.viewDate);
		this.changeSelectedView.emit(event.view);
	}

	public showDisplayOptions() {
		this.dialog.open(MonthDisplayOptionsComponent);
	}

	private handleDateChanged(date: Date) {

		this.header = getWeekHeaderDays({ viewDate: date, excluded: [] });
		this.calendarStore.getDataForMonth(date);
	}

}