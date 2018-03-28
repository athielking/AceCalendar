import {Component, Input} from '@angular/core'

import { CalendarJob } from '../calendar/common/models'

@Component({
    selector: "ac-simple-job",
    templateUrl: "./simple-job-card.component.html",
    styleUrls: ["./simple-job-card.component.scss"]
})
export class SimpleJobCardComponent{
    @Input() job: CalendarJob;
}