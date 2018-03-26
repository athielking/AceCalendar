import {User} from './user.model';

export class Organization {

    public users: User[];
    
    constructor(public id: string,
                public name: string){
                }
}