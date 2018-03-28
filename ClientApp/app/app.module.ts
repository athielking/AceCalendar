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
  MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule, MatChipsModule } from '@angular/material';

import { CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
  CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
  CovalentNotificationsModule, CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule, CovalentChipsModule } from '@covalent/core';

import { AppComponent } from './components/app/app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarReadonlyComponent } from "./components/calendar/calendar-readonly.component";
import { WorkerComponent } from './components/worker/worker.component';
import { AddWorkerComponent } from './components/worker/addWorker.component';
import { AvailableWorkerPickerComponent } from './components/worker/availableWorkerPicker.component';
import { WorkerListComponent } from './components/worker/worker-list.component';
import { WorkerCardComponent } from './components/worker/worker-card.component';
import { JobListComponent } from './components/job/job-list.component';
import { WorkerDetailComponent } from './components/worker/worker-detail.component';
import { AddTimeOffComponent } from './components/worker/add-time-off.component';
import { AddWorkerToComponent } from './components/worker/add-worker-to.component';

import { JobComponent } from './components/job/job.component';
import { AddJobToWeekViewComponent } from "./components/job/addJobToWeekViewComponent";
import { AddJobToDayViewComponent } from "./components/job/addJobToDayViewComponent";
import { JobNotesComponent } from "./components/job/jobNotes.component";
import { SimpleJobCardComponent } from './components/job/simple-job-card.component';

import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { MonthViewComponent } from './components/calendar/month/month-view.component';
import { MonthCellComponent } from './components/calendar/month/month-cell.component';
import { MonthDisplayOptionsComponent } from './components/calendar/month/month-displayOptions.component';

import { DayViewComponent } from "./components/calendar/day/day-view.component";
import { WeekViewComponent } from "./components/calendar/week/week-view.component";
import { WeekViewReadonlyComponent } from "./components/calendar/week/readonly/week-view-readonly.component";
import { WeekViewPhoneComponent } from "./components/calendar/week/readonly/week-view-phone.component";
import { WeekCellComponent } from "./components/calendar/week/week-cell.component";
import { WeekCellJobComponent } from "./components/calendar/week/week-cell-job.component";
import { AddTagComponent } from "./components/tag/add-tag.component";
import { TagComponent } from "./components/tag/tag.component";
import { TagListComponent } from "./components/tag/tag-list.component";
import { SelectTagComponent } from "./components/tag/select-tag.component";

import { OrganizationListComponent } from './components/admin/organization-list.component';
import { OrganizationDetailComponent } from './components/admin/organization-detail.component';
import { AddOrganizationComponent } from './components/admin/add-organization.component';
import { AddUserComponent} from './components/admin/add-user.component';
import { LoginComponent } from "./components/login/login.component";
import { ChangePasswordComponent } from './components/login/change-password.component';
import { JwtHelper } from './services/jwtHelper.service';
import { StorageService } from './services/storage.service';
import { JobService } from './services/job.service';
import { CalendarService } from './services/calendar.service';
import { WorkerService } from './services/worker.service';
import { AuthService } from "./services/auth.service";
import { TagService } from "./services/tag.service";
import { OrganizationService } from './services/organization.service';
import { UserService } from './services/user.service';

import { CalendarStore } from './stores/calendar.store';
import { WorkerStore } from './stores/worker.store';
import { JobStore } from './stores/job.store';
import { TagStore } from "./stores/tag.store";
import { OrganizationStore } from './stores/organization.store';

import { AuthInterceptor } from './tools/authInterceptor';
import { AuthGuardEditor, AuthGuardAdmin } from "./services/auth-guard.service";


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    CalendarComponent,
    CalendarReadonlyComponent,
    
    //Tag CRUD
    AddTagComponent,
    TagComponent,
    TagListComponent,
    SelectTagComponent,

    //Worker CRUD
    WorkerComponent,
    AddWorkerComponent,
    AvailableWorkerPickerComponent,
    WorkerListComponent,
    WorkerCardComponent,
    WorkerDetailComponent,
    AddTimeOffComponent,
    AddWorkerToComponent,

    //Job CRUD
    JobComponent,
    AddJobToWeekViewComponent,
    AddJobToDayViewComponent,    
    JobNotesComponent,
    JobListComponent,
    SimpleJobCardComponent,

    //Month View
    MonthViewComponent,
    MonthCellComponent,
    MonthDisplayOptionsComponent,

    //Week View
    WeekViewComponent,
    WeekViewReadonlyComponent,
    WeekViewPhoneComponent,
    WeekCellComponent,
    WeekCellJobComponent,

    //Organization
    OrganizationListComponent,
    OrganizationDetailComponent,
    AddOrganizationComponent,
    AddUserComponent,

    DayViewComponent,

    //Auth
    LoginComponent,
    ChangePasswordComponent
  ],
  entryComponents: [
    AddWorkerComponent,
    AddJobToWeekViewComponent,
    AddJobToDayViewComponent,
    JobNotesComponent,
    AddTimeOffComponent,
    AddWorkerToComponent,
    DayViewComponent,
    MonthDisplayOptionsComponent,
    ChangePasswordComponent,
    AddTagComponent,
    SelectTagComponent,
    AddOrganizationComponent,
    AddUserComponent
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
    MatGridListModule, MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule, MatChipsModule,
    
    /** Covalent Modules */
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule, CovalentStepsModule,
    CovalentDialogsModule, CovalentLoadingModule, CovalentSearchModule, CovalentPagingModule, CovalentNotificationsModule,
    CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule, CovalentChipsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'calendar', pathMatch: 'full'},
      { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuardEditor] },
      { path: 'calendar-readonly', component: CalendarReadonlyComponent },      
      { path: 'worker', component: WorkerComponent, canActivate: [AuthGuardEditor] }, 
      { path: 'worker/:id', component: WorkerDetailComponent, canActivate: [AuthGuardEditor]},    
      { path: 'job', component: JobComponent, canActivate: [AuthGuardEditor] }, 
      { path: 'tag', component: TagListComponent, canActivate: [AuthGuardEditor] },
      { path: 'organization', component: OrganizationListComponent, canActivate: [AuthGuardAdmin] },
      { path: 'organization/:id', component: OrganizationDetailComponent, canActivate: [AuthGuardAdmin] },
      { path: "**", redirectTo: 'calendar' }
    ])
  ],
  providers: [
    //Services
    JobService,
    WorkerService,
    AuthService,
    CalendarService,
    StorageService,
    TagService,
    OrganizationService,
    UserService,
    JwtHelper,
    AuthGuardEditor,
    AuthGuardAdmin,
    //Stores
    OrganizationStore,
    CalendarStore,
    TagStore,
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
