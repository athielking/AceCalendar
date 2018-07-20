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
  MatIconRegistry,
} from '@angular/material';

import { AuthService } from "../../services/auth.service";
import { ChangePasswordComponent } from '../login/change-password.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SignalrService } from '../../services/signalr.service';
import { StorageService } from '../../services/storage.service';
import { StorageKeys } from '../calendar/common/calendar-tools';

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

  constructor(
    private authService: AuthService, 
    private dialog: MatDialog,
    private signalRService: SignalrService,
    private storageService: StorageService,
    private _iconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer
  ) {
    this.authorized = !this.authService.loginRequired() && this.storageService.hasItem(StorageKeys.userCalendars);

    this.loggedInUser = this.authService.getLoggedInUser();
    
    this._iconRegistry.addSvgIconInNamespace('assets', 'AceLogoDark',
    this._domSanitizer.bypassSecurityTrustResourceUrl('assets/AceLogoDark.svg'));
    
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

  getOrganizationRoute(){
    return `/organization/${this.authService.getOrganizationId()}`  
  }
}
