import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { AppComponent } from "../app/app.component";

import { LoginModel } from './loginModel';
import { SignalrService } from '../../services/signalr.service';
import { ForgotPasswordComponent } from './forgot-password.component';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    public username: string;
    public password: string;

    public showErrorMessage: boolean;

    constructor(
        private router: Router,
        private appComponent: AppComponent,
        private authService: AuthService,
        private signalRService: SignalrService,
        private loadingService: TdLoadingService,
        private dialogService: TdDialogService
    ) {}

    public login(): void {
        this.showErrorMessage = false;          
        this.toggleShowLoading( true );

        if (!this.username || !this.password) 
            return;

        var loginModel = new LoginModel(this.username, this.password, false);

        this.authService.login(
            loginModel,                
            () => {
                this.toggleShowLoading( false );
                this.appComponent.authorized = true;
                this.appComponent.loggedInUser = this.authService.getLoggedInUser();

                this.signalRService.connect();
                
                this.router.navigate(['calendar']);
            },
            () => {               
                this.showErrorMessage = true;
                this.toggleShowLoading( false );
            }
        );
    }

    public forgotPassword(){
        this.dialogService.open(ForgotPasswordComponent, {});
    }

    private toggleShowLoading(show:boolean): void {
        if (show) {
            this.loadingService.register('showLoading');
        } 
        else {
            this.loadingService.resolve('showLoading');
        }
    }
}

  