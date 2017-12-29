import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent {

    username: string;
    password: string;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    login(): void {
        if (this.username && this.password) {
            // this.authService.login(this.username, this.password)
            //     .subscribe(
            //         () => {
            //             console.log("User is logged in");
            //             this.router.navigateByUrl('/');
            //         }
            //     );
        }
    }
}

  