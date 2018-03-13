import * as addDays from 'date-fns/add_days';
import * as addHours from 'date-fns/add_hours';
import * as addMinutes from 'date-fns/add_minutes';
import * as addSeconds from 'date-fns/add_seconds';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as differenceInMinutes from 'date-fns/difference_in_minutes';
import * as differenceInSeconds from 'date-fns/difference_in_seconds';
import * as endOfDay from 'date-fns/end_of_day';
import * as endOfMonth from 'date-fns/end_of_month';
import * as endOfWeek from 'date-fns/end_of_week';
import * as getDay from 'date-fns/get_day';
import * as isDate from 'date-fns/is_date';
import * as isSameDay from 'date-fns/is_same_day';
import * as isSameMonth from 'date-fns/is_same_month';
import * as isSameSecond from 'date-fns/is_same_second';
import * as max from 'date-fns/max';
import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as startOfDay from 'date-fns/start_of_day';
import * as startOfMinute from 'date-fns/start_of_minute';
import * as startOfMonth from 'date-fns/start_of_month';
import * as startOfWeek from 'date-fns/start_of_week';
import * as subDays from 'date-fns/sub_days';

import { CalendarDay, MonthView } from '../common/models';

export enum DAYS_OF_WEEK {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}

export enum StorageKeys{
    viewDate = "VIEW_DATE",
    selectedTab = "SELECTED_TAB",
    monthViewShowJobs = "MONTH_VIEW_SHOW_JOBS",
    monthViewShowAvailable = "MONTH_VIEW_SHOW_AVAILABLE",
    monthViewShowOff = "MONTH_VIEW_SHOW_OFF",
    addWorkerOption = "ADD_WORKER_OPTION",
    readonlyViewDate = "READONLY_VIEW_DATE",
    readonlySelectedTab = "READONLY_SELECTED_TAB",
}

const DAYS_IN_WEEK: number = 7;

export function getCalendarDay(date : Date, viewDate:Date ): CalendarDay {
    viewDate = startOfDay(viewDate);
    const today : Date = startOfDay(new Date());
    
    return new CalendarDay(
        date,
        isSameDay(date, today),
        date < today,
        date > today,
        getDay(date) == DAYS_OF_WEEK.SATURDAY || getDay(date) == DAYS_OF_WEEK.SUNDAY,
        isSameMonth(date, viewDate)
    );
}

export function getWeekHeaderDays({
    viewDate,
    excluded,
}: {
        viewDate: Date;
        excluded: number[];
    }): CalendarDay[] {

    const start: Date = startOfWeek(viewDate);
    const days: CalendarDay[] = [];

    for (let i: number = 0; i < DAYS_IN_WEEK; i++) {
        const date: Date = addDays(start, i);

        if (!excluded.some(e => date.getDay() === e)) {
            days.push(getCalendarDay( date, viewDate ));
        }
    }

    return days;
}

export function getMonthView({
    viewDate, 
    excluded
}: {
    viewDate: Date;
    excluded: number[]
}): MonthView {

    let header: CalendarDay[] = getWeekHeaderDays({viewDate, excluded});
    let start: Date = startOfMonth(viewDate);
    if(start.getDay() !== DAYS_OF_WEEK.SUNDAY)
        start = subDays(start, start.getDay());

    let end: Date = endOfMonth(viewDate);
    if(end.getDay() !== DAYS_OF_WEEK.SATURDAY)
        end = addDays(end, (DAYS_OF_WEEK.SATURDAY - end.getDay()));

    const daysInMonth = differenceInDays(end, start);

    const days: CalendarDay[] = [];

    for(let i:number = 0; i<=daysInMonth; i++)
    {
        const date: Date = addDays(start, i);
        
            if (!excluded.some(e => date.getDay() === e)) {
                days.push(getCalendarDay( date, viewDate ));
            }
    }

    return new MonthView(header, days);
}