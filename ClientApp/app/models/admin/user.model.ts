export class AddUserModel{
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public userName: string,
        public role: string,
        public password: string
    ){
    }
}

export class EditUserModel{
    constructor(
        public id: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public role: string
    ){
    }
}

export enum Roles{
    User = 'User',
    Readonly = "Readonly",
    Admin = "Admin",
    OrganizationAdmin = "Organization Admin"
}