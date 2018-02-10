import {Component, Input, EventEmitter} from '@angular/core'

import {DayView} from '../common/models'

@Component({
    selector: "ac-worker-list",
    templateUrl: "./week-available.component.html",
    styleUrls: ["../common/calendar-card.scss"]
})
export class WeekAvailableComponent {
    @Input() dayView: DayView;
    
    constructor(){
    }
}