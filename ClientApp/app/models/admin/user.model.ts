export class User{
    constructor(public id: string,
                public email: string,
                public firstName: string,
                public lastName: string,
                public userName: string,
                public organizationId: string,
                public role: string,
                public password: string){
                }

    public isEditingUser(): boolean{
        return this.role == Roles.Admin || this.role == Roles.User;
    }
}

export enum Roles{
    User = 'User',
    Readonly = "Readonly",
    Admin = "Admin"
}