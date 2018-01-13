import "styles.css";

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatListModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatButtonToggleModule,
  MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatToolbarModule,
  MatTabsModule, MatSidenavModule, MatTooltipModule, MatRippleModule, MatRadioModule, MatGridListModule,
  MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule } from '@angular/material';

import { CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
  CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
  CovalentNotificationsModule, CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule } from '@covalent/core';

import { AlertModule } from 'ngx-bootstrap';

import { AppComponent } from './components/app/app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { WorkerComponent } from './components/worker/worker.component';
import { AddWorkerComponent } from './components/worker/addWorker.component';
import { AvailableWorkerPickerComponent } from './components/worker/availableWorkerPicker.component';
import { JobComponent } from './components/job/job.component';
import { AddJobComponent } from './components/job/addJob.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { MonthViewComponent } from './components/calendar/month/month-view.component';
import { MonthCellComponent } from './components/calendar/month/month-cell.component';
import { LoginComponent } from "./components/login/login.component";

import { JobService } from './services/job.service';
import { CalendarService } from './services/calendar.service';
import { WorkerService } from './services/worker.service';
import { AuthService } from "./services/auth.service";

import { CalendarStore } from './stores/calendar.store';
import { WorkerStore } from './stores/worker.store';
import { JobStore } from './stores/job.store';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    CalendarComponent,
    WorkerComponent,
    AddWorkerComponent,
    AvailableWorkerPickerComponent,
    JobComponent,
    AddJobComponent,
    MonthViewComponent,
    MonthCellComponent,
    LoginComponent
  ],
  entryComponents: [
    AddWorkerComponent,
    AddJobComponent
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    /** Material Modules */
    MatButtonModule, MatListModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatSelectModule,
    MatButtonToggleModule, MatSlideToggleModule, MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule,
    MatToolbarModule, MatTabsModule, MatSidenavModule, MatTooltipModule, MatRippleModule, MatRadioModule,
    MatGridListModule, MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule,
    /** Covalent Modules */
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule, CovalentStepsModule,
    CovalentDialogsModule, CovalentLoadingModule, CovalentSearchModule, CovalentPagingModule, CovalentNotificationsModule,
    CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule,
    AlertModule.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'calendar', component: CalendarComponent },
      { path: 'worker', component: WorkerComponent },     
      { path: 'job', component: JobComponent }, 
      { path: "**", redirectTo: 'home' }
    ])
  ],
  providers: [
    //Services
    JobService,
    WorkerService,
    AuthService,
    CalendarService,
    //Stores
    CalendarStore,
    WorkerStore,
    JobStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
