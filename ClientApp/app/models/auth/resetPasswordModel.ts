export class ResetPasswordModel{
    constructor(public userName: string,
                public password: string,
                public code: string){}
}