import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'

import { DayView } from '../../calendar/common/models'

@Component({
    selector: 'ac-week-cell',
    templateUrl: './week-cell.component.html',
    styleUrls: ['../common/calendar-card.scss']
})
export class WeekCellComponent {
    @Input() dayView: DayView;
    
    constructor() {
    }
}