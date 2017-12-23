import { Component, Input, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core'
import { MatTooltip } from '@angular/material'
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { getMonthView } from '../../calendar/common/calendar-tools'
import { CalendarDay, CalendarJob, Worker } from '../../calendar/common/models'
import { JobStore } from '../../../stores/job.store';
import { AssetStore } from '../../../stores/asset.store';

@Component({
    selector: 'ac-month-cell',
    templateUrl: './month-cell.component.html',
    providers: [JobStore, AssetStore]
  })
  export class MonthCellComponent 
    implements OnInit {
        @Input() monthDay : CalendarDay;

        availableWorkers$ : Observable<List<Worker>>

        constructor(
            private jobStore: JobStore,
            private assetStore: AssetStore,
            private cdr: ChangeDetectorRef
        ) {
        }

        ngOnInit(){
            this.jobStore.initialize(this.monthDay.date);
            this.availableWorkers$ = this.assetStore.getAvailableWorkers(this.monthDay.date);
        }

        workerTooltip(){
            return this.availableWorkers$.map(list => {
                return list.toArray().map( worker => worker.name).join("</br>")
            });
        }

        jobs_clicked(){

        }

        assets_clicked(){

        }

        available_clicked(){

        }
    }