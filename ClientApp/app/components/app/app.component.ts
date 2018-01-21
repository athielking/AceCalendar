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
} from '@angular/material';

import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  
  public title = 'app';
  public authorized: boolean;
  public loggedInUser: string;

  constructor( private authService: AuthService ) {
    this.authorized = !this.authService.loginRequired(); 
    this.loggedInUser = this.authService.getLoggedInUser();
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
