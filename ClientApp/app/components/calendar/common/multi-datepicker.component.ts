import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core'
import * as dateFns from 'date-fns'

import {DAYS_OF_WEEK} from './calendar-tools';
import * as dateTools from '../../../tools/dateTools';

@Component({
    selector: 'ac-multi-datepicker',
    templateUrl: './multi-datepicker.component.html',
    styleUrls: ['./multi-datepicker.component.scss']
})
export class MultiDatePickerComponent implements OnInit, OnChanges {
    @Input() viewDate: Date;
    @Input() selectedDays: Date[] = [];
    @Output() selectedDaysChange: EventEmitter<Date[]> = new EventEmitter<Date[]>();
    @Output() changeViewDateRequested: EventEmitter<ChangeViewDateEvent> = new EventEmitter<ChangeViewDateEvent>();

    private monthDays: SelectedDate[] = [];
    public dateOffset: number = 1;
    private lastClicked: SelectedDate;

    constructor(){
        
    }

    ngOnInit(){

        if(!this.viewDate)
            this.viewDate = new Date();

        this._initializeMonth();
    }

    ngOnChanges(changes: SimpleChanges){

        if(changes.viewDate)
            this._initializeMonth();
    }

    public toggleSelectDay( day: SelectedDate, event ){
        
        if(event.shiftKey && this.lastClicked){
            this._handleShiftToggle(day);
            window.getSelection().removeAllRanges();
            return;
        }
        
        day.selected = !day.selected;
        this.lastClicked = day;

        var selectedIndex = this.selectedDays.findIndex((value) => this._datesAreEqual(value, day.date));
        
        if( day.selected && selectedIndex == -1 )
        {
            this.selectedDays.push( day.date );
            this.selectedDaysChange.emit( this.selectedDays );
        }
        else if( !day.selected && selectedIndex >= 0 )
        {
            this.selectedDays.splice(selectedIndex, 1);
            this.selectedDaysChange.emit( this.selectedDays );
        }
    }

    public monthBack(){
        this.changeViewDateRequested.emit({
            newDate: dateFns.addMonths(this.viewDate, -1)
        });
    }

    public monthForward(){
        this.changeViewDateRequested.emit({
            newDate: dateFns.addMonths(this.viewDate, 1)
        });
    }

    private _initializeMonth(){
        this.monthDays = [];

        let start = dateFns.startOfMonth(this.viewDate);
        this.dateOffset = dateFns.getDay(start) + 1;

        let end = dateFns.endOfMonth(this.viewDate);

        for( let i : number = 0; dateFns.addDays(start, i) <= end; i++ )
        {
            var date = dateFns.addDays(start, i);

            var selected = this.selectedDays.findIndex((value) => this._datesAreEqual(value, date)) > -1;

            this.monthDays.push( {
                date: date,
                selected: selected
            });
        }
    }

    private _datesAreEqual( d1: Date, d2: Date){
        return dateTools.equal(d1, d2);
    }

    private _handleShiftToggle( day: SelectedDate ){

        if(!this.lastClicked)
            return;

        var clickedSelected = day.selected;

        var start = day.date < this.lastClicked.date ? day.date : this.lastClicked.date;
        var end = day.date > this.lastClicked.date ? day.date: this.lastClicked.date;

        this.monthDays.forEach( (monthDate) => {
            if( monthDate.date < start )
                return;

            if( monthDate.date > end )
                return;
            
            var index = this.selectedDays.findIndex( (selectedDate) => this._datesAreEqual(selectedDate, monthDate.date));
            if(!clickedSelected)
            {
                monthDate.selected = true;
                if( index == -1 )
                    this.selectedDays.push(monthDate.date);
            }
            else
            {
                monthDate.selected = false;
                if( index > -1 )
                   this.selectedDays.splice(index, 1);
            }
        });

        this.selectedDaysChange.emit(this.selectedDays);
        this.lastClicked = day;
    }
}

export interface SelectedDate{
    date: Date;
    selected: Boolean;
}

export interface ChangeViewDateEvent {
    newDate: Date;
}