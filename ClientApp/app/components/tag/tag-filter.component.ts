import { Component, Input, Output, Optional, EventEmitter, OnInit } from '@angular/core';

import { Tag } from '../../models/tag/tag.model';
import { TagStore } from '../../stores/tag.store';
import { MatSelectChange } from '@angular/material';

@Component({
    selector: 'ac-tag-filter',
    templateUrl: './tag-filter.component.html',
    styleUrls: ['./tag-filter.component.scss']
})
export class TagFilterComponent {

    @Input() disabled: boolean = false;
    @Input() availableTags: Tag[];
    @Input() tagFilter: Tag[] = []
    @Input() labelText: string; 
    @Input() placeholder: string = 'Tag Filters';
    @Output() tagFilterChange: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();
    
    constructor( 
    ) {
    } 

    ngOnInit(){
    }

    public compareTags(o1: Tag, o2: Tag): boolean{
        return o1 && o2 && o1.id == o2.id;
    }
    
    public selectionChanged($event: EventEmitter<MatSelectChange>) {
        this.tagFilterChange.emit( this.tagFilter );
    }
}

