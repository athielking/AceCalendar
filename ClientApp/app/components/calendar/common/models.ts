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
                public cssClass?: string
            ){
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
                public draggable?: boolean
            ){
    }
}

export interface Asset {
    id: number,
    name: string, 
    type: string
}

export class Worker implements Asset {
    constructor(public id: number,
                public name: string,
                public lastName: string,
                public phone: string,
                public type: string){
    }
}

export class Equipment implements Asset{
    constructor(public id: number,
                public name: string,
                public type: string,
                public rented: boolean){
                    
                }
}