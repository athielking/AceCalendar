import * as dateFns from 'date-fns'

export function datesAreEqual(d1: Date, d2: Date): boolean{
    return dateFns.getYear(d1) == dateFns.getYear(d2) && 
            dateFns.getMonth(d1) == dateFns.getMonth(d2) && 
            dateFns.getDate(d1) == dateFns.getDate(d2);
}