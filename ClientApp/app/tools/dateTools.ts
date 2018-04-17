import * as dateFns from 'date-fns'

export function equal(d1: Date, d2: Date): boolean{
    return dateFns.getYear(d1) == dateFns.getYear(d2) && 
            dateFns.getMonth(d1) == dateFns.getMonth(d2) && 
            dateFns.getDate(d1) == dateFns.getDate(d2);
}

export function lessThan( d1: Date, d2: Date): boolean{

    let y1 = dateFns.getYear(d1);
    let y2 = dateFns.getYear(d2);
    let m1 = dateFns.getMonth(d1);
    let m2 = dateFns.getMonth(d2);
    let day1 = dateFns.getDate(d1);
    let day2 = dateFns.getDate(d2);

    if( y1 < y2 )
        return true;
    
    if( y1 == y2 && m1 < m2 )
        return true;
    
    if( y1 == y2 && m1 == m2 && day1 < day2 )
        return true;
    
    return false;
}

export function greaterThan( d1: Date, d2: Date): boolean{

    let y1 = dateFns.getYear(d1);
    let y2 = dateFns.getYear(d2);
    let m1 = dateFns.getMonth(d1);
    let m2 = dateFns.getMonth(d2);
    let day1 = dateFns.getDate(d1);
    let day2 = dateFns.getDate(d2);

    if( y1 > y2 )
        return true;
    
    if( y1 == y2 && m1 > m2 )
        return true;
    
    if( y1 == y2 && m1 == m2 && day1 > day2 )
        return true;
    
    return false;
}

export function lessThanEqual( d1: Date, d2: Date): boolean{
    return equal(d1, d2) || lessThan(d1, d2);
}

export function greaterThanEqual( d1: Date, d2: Date): boolean{
    return equal(d1, d2) || greaterThan(d1, d2);
}

export function inRange( date: Date, start: Date, end: Date, inclusive: boolean = true){

    let gt = inclusive ? greaterThanEqual : greaterThan;
    let lt = inclusive ? lessThanEqual : lessThan;

    return gt(date, start) && lt(date, end);
}