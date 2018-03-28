export class ChangePasswordModel{
    constructor(public userName: string,
                public currentPassword: string,
                public newPassword: string ){
    }
}