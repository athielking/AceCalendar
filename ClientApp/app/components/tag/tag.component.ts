import {Component, Input} from '@angular/core';
import { Tag } from '../../models/tag/tag.model';

@Component({
    selector: 'ac-tag',
    templateUrl: './tag.component.html'
})
export class TagComponent{
    @Input() model: Tag;

}