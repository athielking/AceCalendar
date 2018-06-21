// import {Component, Inject} from '@angular/core';
// import {FormControl, Validators} from '@angular/forms';
// import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
// import {TdDialogService,TdLoadingService} from '@covalent/core';

// import {User} from '../../models/admin/user.model';
// import {OrganizationStore} from '../../stores/organization.store';
// import {ChangePasswordComponent} from '../../components/login/change-password.component';
// import { AuthService } from '../../services/auth.service';

// @Component({
//     selector: 'ac-add-user',
//     templateUrl: './add-user.component.html'
// })
// export class AddUserComponent {

//     private isEdit: boolean;
//     private editId: string;
//     private organizationId: string;

//     public userName: string;
//     public email: string;
//     public firstName: string;
//     public lastName: string;
//     public userRole: string = "Readonly";
//     public password: string;
//     public confirmPassword: string;
    
//     constructor(
//         private organizationStore: OrganizationStore,
//         private dialogRef: MatDialogRef<AddUserComponent>,
//         private dialog: MatDialog,
//         private dialogService: TdDialogService,
//         private loadingService: TdLoadingService,
//         private authService: AuthService,
//         @Inject(MAT_DIALOG_DATA) public data: any
//     ) { 
//         this.organizationId = data.organizationId;

//         this.isEdit = data.isEdit,
//         this.editId = data.editId,
//         this.userName = data.userName,
//         this.email = data.email,
//         this.firstName = data.firstName,
//         this.lastName = data.lastName,
//         this.userRole = data.userRole
//     }

//     public changePassword(){
//         this.dialog.open(ChangePasswordComponent, {data:{
//             userName: this.userName
//         }});
//     }

//     public onCancelClick() {
//         this.dialogRef.close();
//     }

//     public onOkClick() {

//         if(!this.isEdit && this.password != this.confirmPassword)
//         {
//             this.dialogService.openAlert({
//                 message: "Passwords do not match",
//                 title: "Error"
//             });
//             return;
//         }

//         if(this.isEdit)
//             this.editUser();
//         else
//             this.addUser();
//     }

//     private addUser() {
//         this.toggleShowLoading(true);

//         var user = new User('', this.email, this.firstName, this.lastName, this.userName, this.organizationId, this.userRole, this.password);

//         this.organizationStore.addUser(user).subscribe( result => {
//             this.dialogRef.close();
//             this.toggleShowLoading(false);
//         }, error => {
//             this.toggleShowLoading(false);
//             this.dialogService.openAlert({
//                 message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
//                 title: 'Unable to Add User'
//             });
//         } ); 
//     }

//     private editUser() {
//         this.toggleShowLoading(true);

//         var user = new User( this.editId, this.email, this.firstName, this.lastName, this.userName, this.organizationId, this.userRole, '');

//         this.organizationStore.editUser(user).subscribe( result => {
//             this.dialogRef.close();
//             this.toggleShowLoading(false);
//         }, error => {
//             this.toggleShowLoading(false);
//             this.dialogService.openAlert({
//                 message: error.error['errorMessage'] ? error.error['errorMessage'] : error.message,
//                 title: 'Unable to Update User'
//             });
//         } ); 
//     }

//     public compareRoles( o1: string, o2: string): boolean{
//         return o1 == o2;
//     }

//     private toggleShowLoading(show:boolean) {
//         if (show) {
//             this.loadingService.register('addUserShowLoading');
//         } 
//         else {
//             this.loadingService.resolve('addUserShowLoading');
//         }
//     }
// }