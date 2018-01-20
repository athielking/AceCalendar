import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

import { LoginModel } from './loginModel';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent {

    public username: string;
    public password: string;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    public login(): void {
        if (this.username && this.password) {
            var loginModel = new LoginModel(this.username, this.password, false);
            this.authService.login(loginModel);
        }
    }
}

  