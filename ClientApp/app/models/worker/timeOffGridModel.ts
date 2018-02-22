import { DeleteButtonGridModel } from '../shared/deleteButtonGridModel';

export class TimeOffGridModel extends DeleteButtonGridModel{
    public date: Date

    constructor( date: Date ){
        super();
        this.date = date;
    }
}