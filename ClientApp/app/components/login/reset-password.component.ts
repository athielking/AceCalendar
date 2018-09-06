import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from "../../services/auth.service";
import { TdLoadingService } from '@covalent/core';
import { AppComponent } from "../app/app.component";

import { ChangePasswordModel } from '../../models/auth/changePasswordModel';
import { ResetPasswordModel } from '../../models/auth/resetPasswordModel';

@Component({
    selector: "ac-reset-password",
    templateUrl: "./reset-password.component.html"
})
export class ResetPasswordComponent implements OnInit{
    public username: string;
    public password: string;
    public confirmPassword: string;

    public showSuccessMessage: boolean;
    public showErrorMessage: boolean;
    public errorMessage: string = "Failed to Reset Password";

    private tokenCode: string; 

    constructor(private authService: AuthService,
                private route: ActivatedRoute,
                private router: Router,
                private loadingService: TdLoadingService,
               ){
        }

    ngOnInit(){
        // var sub = this.route.paramMap.subscribe((params: ParamMap) => {
        //     this.tokenCode = params.get('code');
        // }, null, () => {sub.unsubscribe()})

        var sub = this.route.queryParamMap.subscribe((params: ParamMap) => {
            this.tokenCode = params.get('code');
        }, null, ()=>{sub.unsubscribe()});
    }

    public changePassword(){

        this.showSuccessMessage = false;
        this.showErrorMessage = false;

        if(this.password != this.confirmPassword)
        {
            this.showErrorMessage= true;
            this.errorMessage = "Passwords do not match"
            return;
        }
        
        this.toggleShowLoading(true);

        var sub = this.authService.resetPassword(new ResetPasswordModel(this.username,this.password, this.tokenCode))
            .subscribe( result => {
                this.toggleShowLoading(false);
                this.showSuccessMessage = true;
                window.setTimeout( () => {
                    this.router.navigate(['calendar']);
                }, 2000);
                
            }, error => {
                this.toggleShowLoading(false);
                this.showErrorMessage = true;
                this.errorMessage = error.error['errorMessage'];

            }, () => {
                sub.unsubscribe();
            });

    }

    private toggleShowLoading(show:boolean): void {
        if (show) {
            this.loadingService.register('showLoadingResetPassword');
        } 
        else {
            this.loadingService.resolve('showLoadingResetPassword');
        }
    }
}