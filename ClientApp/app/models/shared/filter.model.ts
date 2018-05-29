import { Tag, ITaggedEntity } from "../tag/tag.model";

export interface IFilter {
    enabled: boolean,
    matchesFilter(entity: any): boolean
}

export enum FilterOperation {
    And = 0,
    Or = 1
}

export enum FilterContains {
    Contains = 0,
    DoesNotContain = 1
}

export class TagFilter implements IFilter {

    public enabled: boolean = false;
    public tags: Tag[] = [];
    public contains: FilterContains = FilterContains.Contains;
    public operation: FilterOperation = FilterOperation.And;

    constructor(){}

    public fromJSON( json: string){
        var parsed = JSON.parse(json);

        this.enabled = parsed.enabled;
        this.tags = parsed.tags;
        this.contains = parsed.contains;
        this.operation = parsed.operation;
    }

    public matchesFilter(entity: ITaggedEntity): boolean {

        var matchesFilter: boolean = this.operation == FilterOperation.And;
        
        if(!entity.tags || (entity.tags.length == 0 && this.tags.length > 0))
            return this.contains == FilterContains.DoesNotContain;

        this.tags.forEach( tag => {
            let index = entity.tags.findIndex( t => t.id == tag.id );

            let tagMatch = (this.contains == FilterContains.Contains && index > -1) || (this.contains == FilterContains.DoesNotContain && index == -1);
            matchesFilter = this.doOperation(matchesFilter, tagMatch )
        });

        return matchesFilter;
    }

    private doOperation(value1: boolean, value2: boolean): boolean {

        if( this.operation == FilterOperation.And )
            return value1 && value2;
        if( this.operation == FilterOperation.Or )
            return value1 || value2;
    }
}