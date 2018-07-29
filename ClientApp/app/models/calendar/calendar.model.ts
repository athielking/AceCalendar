export class CalendarModel {
    constructor(public id: string,
                public calendarName: string,
                public organizationId: string,
                public inactive: boolean){}
}

export class CalendarUser {
    constructor(public id: string,
                public calendarId: string, 
                public userId: string){}
}

export class EditCalendarModel {
    constructor( public calendarName: string,
                 public isActive: boolean){
    }
}