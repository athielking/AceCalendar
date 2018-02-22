export class DateRangeModel{
    id: string;
    date: Date;
    end?: Date

    constructor(id: string, date: Date, end?:Date){
        this.id = id;
        this.date = date;
        this.end = end;
    }
}