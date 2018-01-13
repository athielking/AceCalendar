import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';

export class MonthView{
    constructor(public header: CalendarDay[],
                public daysOfMonth: CalendarDay[]){
    }
}

export class DayView{

    constructor(public calendarDay: CalendarDay, 
                public jobs: CalendarJob[],
                public availableWorkers: Worker[])
                {
                }
}

export class CalendarDay {
    constructor(public date:Date,
                public isToday: boolean,
                public isPast: boolean,
                public isFuture: boolean,
                public isWeekend: boolean,
                public inMonth: boolean,
                public cssClass?: string
            ){
    }
}

export class CalendarJob {
    constructor(public id: string,
                public number: number,
                public name: string,
                public type: string,
                public color?: string,
                public cssClass?: string,
                public resizable?: boolean,
                public draggable?: boolean
            ){
    }
}

export class Worker {
    constructor(public id: string,
                public firstName: string,
                public lastName: string,
                public email: string,
                public phone: string){
    }
}

export class AddJobModel {

    public endDate?: Date = null;
    public durationDays?: Number = null;
    public durationMonths?: Number = null;

    public workerIds: string[] = [];
    
    constructor(public number: Number,
                public name: string,
                public type: string,
                public startDate: Date)
                {
                }
}