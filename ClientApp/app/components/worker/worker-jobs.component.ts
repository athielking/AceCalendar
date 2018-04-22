import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core'
import { TdLoadingService } from '@covalent/core';

import { TdDialogService } from '@covalent/core';
import { MonthViewDateComponent } from '../calendar/month/month-view-date.component';
import { ITdDataTableColumn } from '@covalent/core';

import * as date_format from 'date-fns/format';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IPageChangeEvent } from '@covalent/core';
import { WorkerJobsStore } from '../../stores/workerJobs.store';
import { JobByDateGridModel } from '../../models/worker/jobByDateGridModel';
import { ITdDataTableSortChangeEvent } from '@covalent/core';
import { TdDataTableSortingOrder } from '@covalent/core';
import { TdDataTableService } from '@covalent/core';

@Component({
    selector: "ac-worker-jobs",
    templateUrl: "./worker-jobs.component.html"
})
export class WorkerJobsComponent implements OnInit {
    @Output() changeViewDate: EventEmitter<Date> = new EventEmitter<Date>();
    @ViewChild(MonthViewDateComponent) monthViewDate: MonthViewDateComponent;

    private currentPage: number;

    private workerJobsData: JobByDateGridModel[] = [];

    private workerId: string;

    public viewDate: Date;

    public pageSize: number = 5;

    public sortBy: string = 'date';

    public sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

    public workerJobsDataCount: number;

    public workerJobsDataPage: JobByDateGridModel[] = [];

    public jobsColumns: ITdDataTableColumn[] = [
        { name: 'date', label: 'Job Date', format: (value: any) => date_format(value, 'MM/DD/YYYY'), sortable: true },
        { name: 'jobNumber', label: 'Job Number', sortable: true },
        { name: 'jobName', label: 'Job Name', sortable: true }
    ]

    constructor(
        private workerJobsStore: WorkerJobsStore,
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

            this.workerJobsStore.getWorkerJobsData(this.workerId, this.viewDate);
        });

        this.workerJobsStore.workerJobsData.subscribe(workerJobsData => {
            this.workerJobsData = workerJobsData;

            this.updatePageOfData();

            this.workerJobsDataCount = workerJobsData.length;

            this.toggleShowLoading(false);
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

        this.workerJobsStore.getWorkerJobsData(this.workerId, this.viewDate);
    }

    private getSortedData(): JobByDateGridModel[] {

        if (this.sortBy === 'date') {
            var sortedData = this.workerJobsData.sort(function (a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

            if( this.sortOrder === TdDataTableSortingOrder.Descending ) {
                return sortedData.reverse();
            }

            return sortedData;
        }

        return this.dataTableService.sortData(this.workerJobsData, this.sortBy, this.sortOrder);
    }

    private updatePageOfData() {
        if (this.workerJobsData.length === 0) {
            this.workerJobsDataPage = [];
            return;
        }

        var start = (this.currentPage - 1) * this.pageSize;
        var end = this.currentPage * this.pageSize;

        var sortedData = this.getSortedData();

        var pageOfData = sortedData.slice(start, end);

        this.workerJobsDataPage = pageOfData;

        if (this.workerJobsDataPage.length === 0) {
            this.currentPage--;
            this.updatePageOfData();
        }
    }

    private toggleShowLoading(show: boolean) {
        if (show) {
            this.loadingService.register('workerJobsShowLoading');
        }
        else {
            this.loadingService.resolve('workerJobsShowLoading');
        }
    }
}