export class MonthView{
    constructor(public header: CalendarDay[],
                public daysOfMonth: CalendarDay[]){
    }
}

export class CalendarDay {
    constructor(public date:Date,
                public isToday: boolean,
                public isPast: boolean,
                public isFuture: boolean,
                public isWeekend: boolean,
                public inMonth: boolean,
                public cssClass?: string,
                public jobs?: CalendarJob[]){
    }
}

export class CalendarJob {
    constructor(public id:number,
                public jobNumber: string,
                public date: Date,
                public title: string,
                public color?: string,
                public cssClass?: string,
                public resizable?: boolean,
                public draggable?: boolean,
                public workers?: Worker[]){
    }
}

export class Worker {
    constructor(public id: number,
                public name: string,
                public type: string){
    }
}