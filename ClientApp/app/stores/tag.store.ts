import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { TagService } from '../services/tag.service';
import { Tag, TagDto, TagType } from '../models/tag/tag.model';

@Injectable()
export class TagStore{
    private _tags : BehaviorSubject<Tag[]> = new BehaviorSubject([]);
    private _tag: BehaviorSubject<Tag> = new BehaviorSubject(new Tag('','', '', '', TagType.JobsAndWorkers, false));

    public errorMessage: string;

    public hasError: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly tags : Observable<Tag[]> = this._tags.asObservable();
    public readonly tag: Observable<Tag> = this._tag.asObservable();
    
    constructor(private tagService: TagService){
    }

    public addTag(tag: Tag){
        var obs = this.tagService.addTag(tag);
        
        obs.subscribe( response => { 
            this.getTags();
        }, error => {
        });

        return obs;
    }

    public editTag(tag: Tag){
        var obs = this.tagService.editTag(tag);
        
        obs.subscribe( response => { 
            this.getTags();
        }, error => {
        });

        return obs;
    }

    public deleteTag(tagId: string){
        var obs = this.tagService.deleteTag(tagId);

        obs.subscribe( response => {
            this.getTags();
        }, error => {
        })
        
        return obs;
    }

    public getTags(){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.tagService.getTags().subscribe( result => {
            this._tags.next(result.map( tagDto => this.createTag(tagDto) ) );
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }
    
    public getJobTags(){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.tagService.getJobTags().subscribe( result => {
            this._tags.next(result.map( tagDto => this.createTag(tagDto) ) );
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public getWorkerTags(){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.tagService.getWorkerTags().subscribe( result => {
            this._tags.next(result.map( tagDto => this.createTag(tagDto) ) );
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    public getTag(id: string){
        this.isLoading.next(true);
        this.hasError.next(false);

        this.tagService.getTag(id).subscribe( result => {
            this._tag.next(result);
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);            
            this.errorMessage = error.error['errorMessage'] ? error.error['errorMessage'] : error.message;          
            this.hasError.next(true);
        });
    }

    private createTag(tagDto: TagDto): Tag {
        return new Tag( 
            tagDto.id,
            tagDto.icon,
            tagDto.description,
            tagDto.color,
            <TagType>tagDto.tagType,
            tagDto.fromJobDay
        );
    }
}