import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core'
import { TdLoadingService } from '@covalent/core';

import { TimeOffGridModel } from '../../models/worker/timeOffGridModel';
import { TdDialogService } from '@covalent/core';
import { MonthViewDateComponent } from '../calendar/month/month-view-date.component';
import { ITdDataTableColumn } from '@covalent/core';

import * as date_format from 'date-fns/format';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TimeOffStore } from '../../stores/timeOff.store';
import { IPageChangeEvent } from '@covalent/core';
import { TdDataTableSortingOrder } from '@covalent/core';
import { ITdDataTableSortChangeEvent } from '@covalent/core';
import { TdDataTableService } from '@covalent/core';
import { AddTimeOffComponent } from './add-time-off.component';

@Component({
    selector: "ac-worker-time-off",
    templateUrl: "./worker-time-off.component.html"
})
export class WorkerTimeOffComponent implements OnInit {
    @Output() changeViewDate: EventEmitter<Date> = new EventEmitter<Date>();
    @ViewChild(MonthViewDateComponent) monthViewDate: MonthViewDateComponent;

    private currentPage: number;

    private timeOffData: TimeOffGridModel[] = [];

    private workerId: string;

    public sortBy: string = 'date';

    public sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

    public viewDate: Date;

    public pageSize: number = 5;

    public timeOffDataCount: number;

    public timeOffDataPage: TimeOffGridModel[] = [];

    public timeOffColumns: ITdDataTableColumn[] = [
        { name: 'date', label: 'Time Off Date', format: (value: any) => date_format(value, 'MM/DD/YYYY'), sortable: true },
        { name: 'deleteBtn', label: '', width: 100, sortable: false }
    ]

    constructor(
        private timeOffStore: TimeOffStore,
        private loadingService: TdLoadingService,
        private dialogService: TdDialogService,
        private route: ActivatedRoute,
        private dataTableService: TdDataTableService
    ) {
    }

    public ngOnInit() {
        this.viewDate = new Date();

        this.currentPage = 1;

        this.toggleShowLoading(true);

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.workerId = params.get('id');

            this.timeOffStore.getTimeOffData(this.workerId, this.viewDate);
        });

        this.timeOffStore.timeOffData.subscribe(timeOffData => {
            this.timeOffData = timeOffData;

            this.updatePageOfData();

            this.timeOffDataCount = timeOffData.length;

            this.toggleShowLoading(false);
        });
    }

    public deleteTimeOff(timeOffGridModel: TimeOffGridModel) {
        this.dialogService.openConfirm({
            message: 'Are you sure you wish to delete this time off entry?',
            title: 'Confirm Delete'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.toggleShowLoading(true);

                this.timeOffStore.deleteTimeOff(this.workerId, timeOffGridModel)
                    .subscribe(result => {
                        this.toggleShowLoading(false);
                    }, error => {
                        this.toggleShowLoading(false);
                        this.dialogService.openAlert({
                            message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
                            title: 'Unable to Delete Time Off'
                        });
                    });
            }
        });
    }

    public pageChanged(event: IPageChangeEvent): void {
        this.currentPage = event.page;

        this.updatePageOfData();
    }

    public sort(sortEvent: ITdDataTableSortChangeEvent): void {
        this.sortBy = sortEvent.name;
        this.sortOrder = sortEvent.order;

        this.updatePageOfData();
    }

    public onChangeViewDate(date: Date) {
        this.handleDateChanged(date);
        this.changeViewDate.emit(date);
    }

    private handleDateChanged(date: Date) {
        this.viewDate = date;
        this.timeOffStore.getTimeOffData(this.workerId, this.viewDate);
    }

    private getSortedData(): TimeOffGridModel[] {

        if (this.sortBy === 'date') {
            var sortedData = this.timeOffData.sort(function (a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

            if (this.sortOrder === TdDataTableSortingOrder.Descending) {
                return sortedData.reverse();
            }

            return sortedData;
        }

        return this.dataTableService.sortData(this.timeOffData, this.sortBy, this.sortOrder);
    }

    private updatePageOfData() {
        if (this.timeOffData.length === 0) {
            this.timeOffDataPage = [];
            return;
        }

        var start = (this.currentPage - 1) * this.pageSize;
        var end = this.currentPage * this.pageSize;

        var sortedData = this.getSortedData();

        var pageOfData = sortedData.slice(start, end);

        this.timeOffDataPage = pageOfData;

        if (this.timeOffDataPage.length === 0) {
            this.currentPage--;
            this.updatePageOfData();
        }
    }

    private toggleShowLoading(show: boolean) {
        if (show) {
            this.loadingService.register('workerDetailTimeOffShowLoading');
        }
        else {
            this.loadingService.resolve('workerDetailTimeOffShowLoading');
        }
    }

    public addTimeOff(){
        let dialogRef = this.dialogService.open(AddTimeOffComponent, {
            disableClose: true,
            data: { 
                idWorker: this.workerId,
                timeOffDays: this.timeOffData.map( data => data.date ),
                viewDate: this.viewDate
            }
        });
    }
}