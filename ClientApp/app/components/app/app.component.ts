import { Component } from '@angular/core';
import { TdLayoutComponent, TdLayoutNavComponent, TdNavigationDrawerComponent, TdLayoutFooterComponent, } from '@covalent/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  authorized = true;
}
