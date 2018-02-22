import {CalendarViews} from '../components/calendar/common/models';

export interface ViewChangeRequest{
    viewDate: Date;
    view: CalendarViews;
}