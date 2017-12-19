import "styles.css";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ngx-bootstrap';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { MonthViewComponent } from './components/calendar/month/month-view.component';
import { MonthCellComponent } from './components/calendar/month/month-cell.component';

import { JobService } from './services/job.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    MonthViewComponent,
    MonthCellComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AlertModule.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'calendar', component: MonthViewComponent },
      { path: "**", redirectTo: 'home' }
    ])
  ],
  providers: [
    JobService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
