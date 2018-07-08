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
  MatProgressSpinnerModule, MatProgressBarModule, MatSelectModule, MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatToolbarModule,
  MatTabsModule, MatSidenavModule, MatTooltipModule, MatRippleModule, MatRadioModule, MatGridListModule,
  MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule, MatChipsModule } from '@angular/material';

import { CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
  CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
  CovalentNotificationsModule, CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule, CovalentChipsModule } from '@covalent/core';

import { AppComponent } from './components/app/app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarReadonlyComponent } from "./components/calendar/calendar-readonly.component";
import { MultiDatePickerComponent } from './components/calendar/common/multi-datepicker.component';

import { WorkerComponent } from './components/worker/worker.component';
import { AddWorkerComponent } from './components/worker/addWorker.component';
import { AvailableWorkerPickerComponent } from './components/worker/availableWorkerPicker.component';
import { WorkerListComponent } from './components/worker/worker-list.component';
import { WorkerCardComponent } from './components/worker/worker-card.component';
import { JobListComponent } from './components/job/job-list.component';
import { WorkerDetailComponent } from './components/worker/worker-detail.component';
import { WorkerDetailHeaderComponent } from './components/worker/worker-detail-header.component';
import { WorkerTimeOffComponent } from './components/worker/worker-time-off.component';
import { WorkerJobsComponent } from './components/worker/worker-jobs.component';
import { AddTimeOffComponent } from './components/worker/add-time-off.component';
import { AddWorkerToComponent } from './components/worker/add-worker-to.component';

import { JobComponent } from './components/job/job.component';
import { AddJobToWeekViewComponent } from "./components/job/addJobToWeekViewComponent";
import { AddJobToDayViewComponent } from "./components/job/addJobToDayViewComponent";
import { JobNotesComponent } from "./components/job/jobNotes.component";
import { SimpleJobCardComponent } from './components/job/simple-job-card.component';

import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { MonthViewComponent } from './components/calendar/month/month-view.component';
import { MonthViewDateComponent } from './components/calendar/month/month-view-date.component';
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
import { SelectJobTagComponent } from "./components/tag/selectJobTag.component";
import { SelectWorkerTagComponent } from "./components/tag/selectWorkerTag.component";

import { OrganizationListComponent } from './components/admin/organization/organization-list.component';
import { OrganizationDetailComponent } from './components/admin/organization/organization-detail.component';
import { AddOrganizationComponent } from './components/admin/organization/add-organization.component';
import { OrganizationDetailHeaderComponent } from './components/admin/organization/organization-detail-header.component'; 
import { AddUserComponent } from "./components/admin/users/add-user.component";
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
import { DefaultPaymentSourceComponent } from './components/admin/payment/default-paymentsource.component';
import { AddPaymentSourceComponent } from './components/admin/payment/add-paymentsource.component';
import { ActivateSubscriptionComponent } from './components/admin/subscription/activate-subscription.component';
import { OrganizationSubscriptionComponent } from './components/admin/subscription/organization-subscription.component';
import { OrganizationUsersComponent } from './components/admin/users/organization-users.component';

import { CalendarStore } from './stores/calendar.store';
import { WorkerStore } from './stores/worker.store';
import { JobStore } from './stores/job.store';
import { TagStore } from "./stores/tag.store";
import { TimeOffStore } from './stores/timeOff.store';
import { WorkerJobsStore } from './stores/workerJobs.store';
import { OrganizationStore } from './stores/organization.store';

import { AuthInterceptor } from './tools/authInterceptor';
import { AuthGuardEditor, AuthGuardAdmin, AuthGuardOrganizationAdmin } from "./services/auth-guard.service";
import { WeekViewPrintComponent } from "./components/calendar/week/print/week-view-print.component";
import { TagFilterComponent } from "./components/tag/tag-filter.component";
import { CalendarFilterComponent } from './components/calendar/common/calendar-filter.component';

import { SubscriptionGuard } from "./services/subscription-guard.service";
import { SignalrService } from "./services/signalr.service";


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    CalendarComponent,
    CalendarReadonlyComponent,
    MultiDatePickerComponent,
    
    //Tag CRUD
    AddTagComponent,
    TagComponent,
    TagListComponent,
    SelectJobTagComponent,
    SelectWorkerTagComponent,
    TagFilterComponent,
    
    //Worker CRUD
    WorkerComponent,
    AddWorkerComponent,
    AvailableWorkerPickerComponent,
    WorkerListComponent,
    WorkerCardComponent,
    WorkerDetailComponent,
    WorkerDetailHeaderComponent,
    WorkerTimeOffComponent,
    WorkerJobsComponent,
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
    MonthViewDateComponent,  
    MonthCellComponent,
    MonthDisplayOptionsComponent,

    //Week View
    WeekViewComponent,
    WeekViewReadonlyComponent,
    WeekViewPhoneComponent,
    WeekViewPrintComponent,
    WeekCellComponent,
    WeekCellJobComponent,

    //Organization
    OrganizationListComponent,
    OrganizationDetailComponent,
    AddOrganizationComponent,
    AddUserComponent,
    OrganizationDetailHeaderComponent,
    OrganizationSubscriptionComponent,
    OrganizationUsersComponent,
    DefaultPaymentSourceComponent,
    AddPaymentSourceComponent,
    ActivateSubscriptionComponent,
    DayViewComponent,

    //Auth
    LoginComponent,
    ChangePasswordComponent,
    CalendarFilterComponent,
  ],
  entryComponents: [
    WeekViewPrintComponent,
    WeekCellJobComponent,
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
    SelectJobTagComponent,
    SelectWorkerTagComponent,
    AddOrganizationComponent,
    AddUserComponent,
    CalendarFilterComponent,
    AddPaymentSourceComponent,
    ActivateSubscriptionComponent
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
    MatButtonToggleModule, MatSlideToggleModule, MatProgressSpinnerModule, MatProgressBarModule, MatDialogModule, MatSnackBarModule,
    MatToolbarModule, MatTabsModule, MatSidenavModule, MatTooltipModule, MatRippleModule, MatRadioModule,
    MatGridListModule, MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule, MatChipsModule,
    
    /** Covalent Modules */
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule, CovalentStepsModule,
    CovalentDialogsModule, CovalentLoadingModule, CovalentSearchModule, CovalentPagingModule, CovalentNotificationsModule,
    CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule, CovalentChipsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'calendar', pathMatch: 'full'},
      { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuardEditor, SubscriptionGuard] },
      { path: 'calendar-readonly', component: CalendarReadonlyComponent },      
      { path: 'worker', component: WorkerComponent, canActivate: [AuthGuardEditor, SubscriptionGuard] }, 
      { path: 'worker/:id', component: WorkerDetailComponent, canActivate: [AuthGuardEditor, SubscriptionGuard]},    
      { path: 'job', component: JobComponent, canActivate: [AuthGuardEditor, SubscriptionGuard] }, 
      { path: 'tag', component: TagListComponent, canActivate: [AuthGuardEditor, SubscriptionGuard] },
      { path: 'organization', component: OrganizationListComponent, canActivate: [AuthGuardAdmin] },
      { path: 'organization/:id', component: OrganizationDetailComponent, canActivate: [AuthGuardOrganizationAdmin] },
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
    AuthGuardOrganizationAdmin,
    AuthGuardAdmin,
    SubscriptionGuard,
    SignalrService,
    //Stores
    OrganizationStore,
    CalendarStore,
    TagStore,
    WorkerStore,
    TimeOffStore,
    WorkerJobsStore,
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
