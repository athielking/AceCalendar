import {Component, Input} from '@angular/core';
import { Tag } from '../../models/tag/tag.model';

@Component({
    selector: 'ac-tag',
    template: `<mat-icon [style.font-size]="'size'" [style.color]="model.color" [matTooltip]="model.description">{{model.icon}}</mat-icon>`,
    styleUrls: ['./tag.component.scss']
})
export class TagComponent{
    @Input() model: Tag;
}