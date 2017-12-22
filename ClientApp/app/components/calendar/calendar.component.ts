import { Component, Input } from '@angular/core'
import { MonthViewComponent } from '../calendar/month/month-view.component'

@Component({
    selector: 'ac-calendar',
    templateUrl: './calendar.component.html'
})
export class CalendarComponent {
    viewDate : Date = new Date();
}