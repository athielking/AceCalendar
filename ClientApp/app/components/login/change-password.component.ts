import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { AuthService } from "../../services/auth.service";
import { TdLoadingService } from '@covalent/core';
import { AppComponent } from "../app/app.component";

import { ChangePasswordModel } from '../../models/auth/changePasswordModel';

@Component({
    selector: "ac-change-password",
    templateUrl: "./change-password.component.html"
})
export class ChangePasswordComponent{
    public username: string;
    public password: string;
    public newPassword: string;
    public confirmPassword: string;

    public showSuccessMessage: boolean;
    public showErrorMessage: boolean;
    public errorMessage: string = "Please check your credentials and try again";

    constructor(private authService: AuthService,
                private router: Router,
                private dialogRef: MatDialogRef<ChangePasswordComponent>,
                private loadingService: TdLoadingService){
        }

    public changePassword(){
        if(this.newPassword != this.confirmPassword)
        {
            this.showErrorMessage= true;
            this.errorMessage = "Passwords do not match"
            return;
        }

        this.showErrorMessage = false;
        this.toggleShowLoading(true);

        this.authService.changePassword(new ChangePasswordModel(this.username,this.password,this.newPassword))
            .subscribe( result => {
                this.toggleShowLoading(false);
                this.showSuccessMessage = true;

                window.setTimeout(()=>{
                    this.dialogRef.close();
                }, 2000);
                
            }, error => {
                this.toggleShowLoading(false);
                this.showErrorMessage = true;
                this.errorMessage = error.error;

            }, () => {
                this.toggleShowLoading(false);
            });

    }

    public cancelClick(){
        this.dialogRef.afterClosed();
    }

    private toggleShowLoading(show:boolean): void {
        if (show) {
            this.loadingService.register('showLoadingChangePassword');
        } 
        else {
            this.loadingService.resolve('showLoadingChangePassword');
        }
    }
}