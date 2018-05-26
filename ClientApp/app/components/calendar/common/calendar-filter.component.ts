import { Component, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatSlideToggleChange, MatDialogRef, MatDialog, MatSelectChange } from '@angular/material';

import { StorageKeys } from './calendar-tools';
import { StorageService } from '../../../services/storage.service';
import { TagFilter, FilterOperation, FilterContains } from '../../../models/shared/filter.model';
import { SelectJobTagComponent } from '../../tag/selectJobTag.component';
import { SelectWorkerTagComponent } from '../../tag/selectWorkerTag.component';
import { SelectTagComponent } from '../../tag/select-tag.component';

@Component({
  selector: 'ac-calendar-filter',
  templateUrl: './calendar-filter.component.html',
  styleUrls: ['./calendar-filter.component.scss']
})
export class CalendarFilterComponent implements OnInit {

	public jobFilter: TagFilter = new TagFilter();
	public workerFilter: TagFilter = new TagFilter();

	constructor(private storageService: StorageService,
				private matDialog: MatDialog,
				private dialogRef: MatDialogRef<CalendarFilterComponent>) { }

  	ngOnInit(){

		if(this.storageService.hasItem(StorageKeys.jobFilter))
            this.jobFilter.fromJSON(this.storageService.getItem(StorageKeys.jobFilter));

		if(this.storageService.hasItem(StorageKeys.workerFilter))
            this.workerFilter.fromJSON(this.storageService.getItem(StorageKeys.workerFilter));
	}

	public selectJobTags(){
		this.selectTags(this.jobFilter, SelectJobTagComponent, StorageKeys.jobFilter);
	}

	public selectWorkerTags(){
		this.selectTags(this.workerFilter, SelectWorkerTagComponent, StorageKeys.workerFilter);
	}

	public filterOperationCompare(o1, o2): boolean{
        return (<FilterOperation>o1) == (<FilterOperation>o2);
	}
	
	public filterContainsCompare(o1, o2): boolean{
        return (<FilterContains>o1) == (<FilterContains>o2);
    }

	public onCloseClick(){

        this.storageService.setItem(StorageKeys.jobFilter, JSON.stringify(this.jobFilter));
        this.storageService.setItem(StorageKeys.workerFilter, JSON.stringify(this.workerFilter));

		this.dialogRef.close();
	}

	private selectTags(filter: TagFilter, type: ComponentType<SelectTagComponent>, key: StorageKeys){
		let ref = this.matDialog.open(type, {
			data: {
				selected: filter.tags
			}
		});

		var sub = ref.afterClosed().subscribe( result => {
			if(!result)
				return;

			filter.tags = ref.componentInstance.selected;
		}, null, () => sub.unsubscribe() );
	}
}
