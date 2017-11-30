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

const DAYS_IN_WEEK: number = 7;

export function getCalendarDay({
    date,
}: { date: Date }): CalendarDay {
    const today: Date = startOfDay(new Date());

    return {
        date,
        isPast: date < today,
        isToday: isSameDay(date, today),
        isFuture: date > today,
        isWeekend: getDay(date) == DAYS_OF_WEEK.SATURDAY || getDay(date) == DAYS_OF_WEEK.SUNDAY
    };
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
            days.push(getCalendarDay({ date }));
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
    const start: Date = startOfMonth(viewDate);
    const end: Date = endOfMonth(viewDate);
    const daysInMonth = differenceInDays(end, start);

    const days: CalendarDay[] = [];

    for(let i:number = 0; i<=daysInMonth; i++)
    {
        const date: Date = addDays(start, i);
        
            if (!excluded.some(e => date.getDay() === e)) {
                days.push(getCalendarDay({ date }));
            }
    }

    return {
        header: header,
        daysOfMonth: days
    };
}