import {Component, Input} from '@angular/core'

import { CalendarJob, CalendarDay } from '../calendar/common/models'
import { MatDialog } from '@angular/material';
import { WeekCellJobComponent } from '../calendar/week/week-cell-job.component';

@Component({
    selector: "ac-simple-job",
    templateUrl: "./simple-job-card.component.html",
    styleUrls: ["./simple-job-card.component.scss"]
})
export class SimpleJobCardComponent{
    @Input() job: CalendarJob;
    @Input() calendarDay: CalendarDay;
    
    constructor( private dialog: MatDialog){}

    public showJobDetails(){
        let ref = this.dialog.open(WeekCellJobComponent, {
            data: {
                calendarDay: this.calendarDay,
                calendarJob: this.job,
                isReadonly: true
            }
        });
    }
}

