import {Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {MatSlideToggleChange, MatDialogRef} from '@angular/material';

import { StorageKeys } from '../common/calendar-tools';
import {StorageService} from '../../../services/storage.service';

@Component({
    templateUrl: "./month-displayOptions.component.html"
})
export class MonthDisplayOptionsComponent implements OnInit{

    public showAllJobs: boolean;
    public showAvailableWorkers: boolean;
    public showOffWorkers: boolean;
    public showTags: boolean;

    constructor(private storageService: StorageService,
                private dialogRef: MatDialogRef<MonthDisplayOptionsComponent> ){

    }

    ngOnInit(){
        this.showAllJobs = this.storageService.hasItem(StorageKeys.monthViewShowJobs) && 
                            this.storageService.getItem(StorageKeys.monthViewShowJobs) == 'true';
        
        this.showAvailableWorkers = this.storageService.hasItem(StorageKeys.monthViewShowAvailable) && 
                                    this.storageService.getItem(StorageKeys.monthViewShowAvailable) == 'true';
        
        this.showOffWorkers = this.storageService.hasItem(StorageKeys.monthViewShowOff ) && 
                              this.storageService.getItem(StorageKeys.monthViewShowOff) == 'true'

        this.showTags = this.storageService.hasItem(StorageKeys.monthViewShowTags ) && 
                              this.storageService.getItem(StorageKeys.monthViewShowTags) == 'true'
    }

    toggleJobsChanged(event: MatSlideToggleChange){
        this.storageService.setItem(StorageKeys.monthViewShowJobs, this.showAllJobs);
    }

    toggleAvailableChanged(event: MatSlideToggleChange){
        this.storageService.setItem(StorageKeys.monthViewShowAvailable, this.showAvailableWorkers);
    }

    toggleOffChanged(event: MatSlideToggleChange){
        this.storageService.setItem(StorageKeys.monthViewShowOff, this.showOffWorkers);
    }

    toggleTagsChanged(event: MatSlideToggleChange){
        this.storageService.setItem(StorageKeys.monthViewShowTags, this.showTags);
    }

    onCloseClick(){
        this.dialogRef.close();
    }
}