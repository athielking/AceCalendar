import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
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
import { OrganizationStore } from '../../stores/organization.store';
import { ValidateSubscription } from '../../models/admin/validateSubscription.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public title = 'app';
  public authorized: boolean;
  public loggedInUser: string;
  public menuOpen: boolean = true;
  public isMobile: boolean;
  public validation: Observable<ValidateSubscription>; 
  
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
    
    this.validation = authService.licenseValidation.merge(signalRService.subscriptionValidation);
  }

  public ngOnInit(){
    this.signalRService.connect();

    if(!this.authService.loginRequired)
        this.authService.getSubscriptionValidation();
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
        this.signalRService.disconnect();
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
