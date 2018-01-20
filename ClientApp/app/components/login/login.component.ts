import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { TdLoadingService } from '@covalent/core';
import { AppComponent } from "../app/app.component";

import { LoginModel } from './loginModel';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private self = this;
    
    public username: string;
    public password: string;

    public showErrorMessage: boolean;

    constructor(
        private appComponent: AppComponent,
        private authService: AuthService,
        private loadingService: TdLoadingService
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
            },
            () => {               
                this.showErrorMessage = true;
                this.toggleShowLoading( false );
            }
        );
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

  