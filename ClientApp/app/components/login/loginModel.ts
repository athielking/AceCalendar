export class LoginModel {

    constructor(
        public userName: string,
        public password: string,
        public rememberMe: boolean,
    ){
    }
}