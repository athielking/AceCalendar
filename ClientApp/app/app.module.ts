import "styles.css";
import './components/calendar/common/calendar-card.scss';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDragDropModule } from 'ng-drag-drop';
import { TextMaskModule } from 'angular2-text-mask';

import { MatButtonModule, MatListModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatButtonToggleModule,
  MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatToolbarModule,
  MatTabsModule, MatSidenavModule, MatTooltipModule, MatRippleModule, MatRadioModule, MatGridListModule,
  MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule } from '@angular/material';

import { CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
  CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
  CovalentNotificationsModule, CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule } from '@covalent/core';

import { AppComponent } from './components/app/app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { WorkerComponent } from './components/worker/worker.component';
import { AddWorkerComponent } from './components/worker/addWorker.component';
import { AvailableWorkerPickerComponent } from './components/worker/availableWorkerPicker.component';
import { WorkerListComponent } from './components/worker/worker-list.component';
import { JobComponent } from './components/job/job.component';
import { AddJobComponent } from './components/job/addJob.component';
import { JobNotesComponent } from "./components/job/jobNotes.component";
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { MonthViewComponent } from './components/calendar/month/month-view.component';
import { MonthCellComponent } from './components/calendar/month/month-cell.component';
import { DayViewComponent } from "./components/calendar/day/day-view.component";
import { WeekViewComponent } from "./components/calendar/week/week-view.component";
import { WeekCellComponent } from "./components/calendar/week/week-cell.component";
import { WeekCellJobComponent } from "./components/calendar/week/week-cell-job.component";


import { LoginComponent } from "./components/login/login.component";

import { JobService } from './services/job.service';
import { CalendarService } from './services/calendar.service';
import { WorkerService } from './services/worker.service';
import { AuthService } from "./services/auth.service";

import { CalendarStore } from './stores/calendar.store';
import { WorkerStore } from './stores/worker.store';
import { JobStore } from './stores/job.store';


import { AuthInterceptor } from './tools/authInterceptor';



@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    CalendarComponent,
    
    //Worker CRUD
    WorkerComponent,
    AddWorkerComponent,
    AvailableWorkerPickerComponent,
    WorkerListComponent,

    //Job CRUD
    JobComponent,
    AddJobComponent,
    JobNotesComponent,

    //Month View
    MonthViewComponent,
    MonthCellComponent,

    //Week View
    WeekViewComponent,
    WeekCellComponent,
    WeekCellJobComponent,
    DayViewComponent,
    LoginComponent
  ],
  entryComponents: [
    AddWorkerComponent,
    AddJobComponent,
    JobNotesComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    TextMaskModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgDragDropModule.forRoot(),
    /** Material Modules */
    MatButtonModule, MatListModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatSelectModule,
    MatButtonToggleModule, MatSlideToggleModule, MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule,
    MatToolbarModule, MatTabsModule, MatSidenavModule, MatTooltipModule, MatRippleModule, MatRadioModule,
    MatGridListModule, MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule,
    /** Covalent Modules */
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule, CovalentStepsModule,
    CovalentDialogsModule, CovalentLoadingModule, CovalentSearchModule, CovalentPagingModule, CovalentNotificationsModule,
    CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'calendar', pathMatch: 'full'},
      { path: 'calendar', component: CalendarComponent },
      { path: 'worker', component: WorkerComponent },     
      { path: 'job', component: JobComponent }, 
      { path: "**", redirectTo: 'calendar' }
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
    JobStore,
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
