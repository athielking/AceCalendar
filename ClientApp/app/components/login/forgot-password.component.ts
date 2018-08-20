import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from "../../services/auth.service";
import { TdLoadingService } from '@covalent/core';
import { ResetPasswordModel } from '../../models/auth/resetPasswordModel';

@Component({
    selector: "ac-forgot-password",
    templateUrl: "./forgot-password.component.html"
})
export class ForgotPasswordComponent implements OnInit{
    public username: string;
    public email: string;
   
    public showSuccessMessage: boolean;
    public showErrorMessage: boolean;
    public errorMessage: string;

    constructor(private authService: AuthService,
                private dialogRef: MatDialogRef<ForgotPasswordComponent>,
                private loadingService: TdLoadingService,
                @Inject(MAT_DIALOG_DATA) public data: any){
        }

    ngOnInit(){
       
    }

    public onCancelClick(){
        this.dialogRef.close(false);
    }

    public onOkClick(){
        this.toggleShowLoading(true);

        this.showErrorMessage = false;
        this.showSuccessMessage = false;
        this.errorMessage = '';

        this.authService.requestPasswordReset(this.username, this.email)
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

    private toggleShowLoading(show:boolean): void {
        if (show) {
            this.loadingService.register('forgotPasswordShowLoading');
        } 
        else {
            this.loadingService.resolve('forgotPasswordShowLoading');
        }
    }
}