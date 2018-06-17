import { Component } from '@angular/core';
import {
  TdLayoutComponent,
  TdLayoutNavComponent,
  TdLayoutManageListComponent,
  TdLayoutManageListToggleDirective,
  TdNavigationDrawerComponent,
  TdLayoutFooterComponent
} from '@covalent/core';
import {
  MatList,
  MatListItem,
  MatIcon,
  MatButton,
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
  MatNavList,
  MatDialog,
} from '@angular/material';

import { AuthService } from "../../services/auth.service";
import { ChangePasswordComponent } from '../login/change-password.component';
import { SignalrService } from '../../services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public title = 'app';
  public authorized: boolean;
  public loggedInUser: string;
  public menuOpen: boolean = true;
  public isMobile: boolean;

  constructor(private authService: AuthService,
              private signalRService: SignalrService,
              private dialog: MatDialog ) {

    this.authorized = !this.authService.loginRequired();
    this.loggedInUser = this.authService.getLoggedInUser();
    
    if(window.screen.width <= 576)
      this.isMobile = true;

    this.signalRService.connect();
  }

  public toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }
  
  public changePassword(){
    this.dialog.open(ChangePasswordComponent, { data: {username: this.loggedInUser }, width: '600px', height: '700px'});
  }

  public logout(): void {
    this.authService.logout(
      () => {
        this.authorized = false;
        this.loggedInUser = "";
      },
      () => {
        //alert with error?        
      }
    );
  }
}
