import {Component, Input} from '@angular/core';
import { Tag } from '../../models/tag/tag.model';

@Component({
    selector: 'ac-tag',
    template: `<mat-icon [style.color]="tag.color" [matTooltip]="tag.description">{{tag.icon}}</mat-icon>`
})
export class TagComponent{
    @Input() model: Tag;
}