import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Tag } from '../../models/tag/tag.model';
import { TagStore } from '../../stores/tag.store';
import { MatSelectChange } from '@angular/material';

@Component({
    selector: 'ac-tag-filter',
    templateUrl: './tag-filter.component.html',
    styleUrls: ['./tag-filter.component.scss']
})
export class TagFilterComponent {

    @Input() availableTags: Tag[];

    @Output() tagFilterChanged: EventEmitter<TagFilterChangedEvent> = new EventEmitter<TagFilterChangedEvent>();
    
    public tagFilter: Tag[] = new Array<Tag>();

    constructor(
    ) {
    } 

    public compareTags(o1: Tag, o2: Tag): boolean{
        return o1 && o2 && o1.id == o2.id;
    }
    
    public selectionChanged($event: EventEmitter<MatSelectChange>) {
        this.tagFilterChanged.emit( {
            tagFilter: this.tagFilter
        } );
    }
}

export interface TagFilterChangedEvent {
    tagFilter: Tag[]
}

