import {Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { CalendarStore } from '../stores/calendar.store';
import { DayView } from '../components/calendar/common/models';

@Injectable()
export class JobCollapseService {

    private _allJobs: DayView[] = [];
    private _collapseAll: BehaviorSubject<boolean> = new BehaviorSubject(false); 
    private _collapsedJobs: BehaviorSubject<Map<Date,string[]>> = new BehaviorSubject(new Map<Date, string[]>());
    
    public collapseAll: Observable<boolean> = this._collapseAll.asObservable();
    public collapsedJobs: Observable<Map<Date,string[]>> = this._collapsedJobs.asObservable();
    
    constructor( private calendarStore: CalendarStore ){
        
        calendarStore.weekData.subscribe( dayViews => {
            this._allJobs = dayViews
         });

        if(this._collapseAll.getValue())
            this._setAllCollapsed();
    }

    public isCollapsed(date: Date, idJob: string){

        var collapsed = this._collapsedJobs.getValue();
        if(!collapsed.has(date))
            return false;
        
        var jobs = collapsed.get(date);
        return jobs.findIndex( j => j === idJob ) !== -1;
    }

    public toggleCollapse(date: Date, idJob: string){
        var map = this._collapsedJobs.getValue();
        if(map.has(date))
        {
            var arr = map.get(date);
            var index = arr.findIndex( s => s === idJob);

            if( index === -1)
                arr.push(idJob);
            else
                arr.splice(index, 1);

            map.set(date, arr);
        }
        else
            map.set(date, [idJob]);
        
        this._collapsedJobs.next(map);
    }

    public toggleCollapseAllJobs(){
        
        var collapsed = this._collapseAll.getValue();
        if(collapsed)
            this._setNoneCollapsed();
        else
            this._setAllCollapsed();
        
        this._collapseAll.next(!collapsed);
    }

    private _setAllCollapsed(){
        var all: Map<Date, string[]> = new Map<Date, string[]>();

        if(!this._allJobs)
            return;

        this._allJobs.forEach( dv => {
            
            var jobs = [];
            dv.jobs.forEach( j => {
                jobs.push( j.id );
            })

            all.set(dv.calendarDay.date, jobs);
        })

        this._collapsedJobs.next(all);
    }

    private _setNoneCollapsed(){
        this._collapsedJobs.next(new Map<Date, string[]>());
    }
}