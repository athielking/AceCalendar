export class ValidateSubscription{
    constructor(public isValid: boolean,
                public allowCalendarEdit: boolean,
                public messages: string[]){}
}