
export interface MonthView{
    header: CalendarDay[];
    daysOfMonth: CalendarDay[];
}

export interface CalendarDay {
    date: Date;
    isToday: boolean;
    isPast: boolean;
    isFuture: boolean;
    isWeekend: boolean;
    inMonth: boolean;
    cssClass?: string;

    jobs?: CalendarJob[];
}

export interface CalendarJob {
    id: string;
    date: Date;
    title: string;
    color: string;
    cssClass?: string;
    resizable?: boolean;
    draggable?: boolean;

    workers?: Worker[];
}

export interface Worker {
    id: string;
    name: string;
    type: string;
}