import {Component, Input, OnInit} from '@angular/core'
import {ActivatedRoute, ParamMap} from '@angular/router'
import {ITdDataTableColumn, TdLoadingService, TdDialogService} from '@covalent/core';
import {MatDialog} from '@angular/material';
import { Organization } from '../../../models/admin/organization.model';
import { PaymentSource } from '../../../models/admin/stripe.model';
import { OrganizationStore } from '../../../stores/organization.store';
import { AuthService } from '../../../services/auth.service';
//import { AddUserComponent } from '../add-user.component';

@Component({
    selector: "ac-organization-detail",
    templateUrl: "./organization-detail.component.html",
    styleUrls: ["./organization-detail.component.scss"]
})
export class OrganizationDetailComponent {
    constructor(
        private authService: AuthService        
    ){
    }
}