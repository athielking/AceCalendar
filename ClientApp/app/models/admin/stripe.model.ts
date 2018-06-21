export class Card implements PaymentSource{
    public icon: string = "credit_card";
    public display: string;

    constructor(public id: string,
                public isDefault: boolean,
                public type: string,
                public address_city: string,
                public address_country: string,
                public address_line1: string,
                public address_line2: string,
                public address_state: string,
                public address_zip: string,
                public brand: string,
                public exp_month: number,
                public exp_year: number,
                public last4: string){
                    this.display = this.brand;
                }
}

export class BankAccount implements PaymentSource{

    public icon: string = "account_balance";
    public display: string;

    constructor(public id: string,
                public isDefault: boolean,
                public type: string,
                public bank_name: string,
                public last4: string){
                    this.display = this.bank_name;
                }
}

export interface PaymentSource {
    id: string;
    isDefault: boolean,
    icon: string;
    type: string;
    last4: string;
    display:string;
}

export class Subscription{
    public productName: string;
    public status: string;
    //public periodEndDate: Date;
    //public isActive: boolean;

    // constructor(
    //     public planId: string,
    //     public productName: string,
    //     public status: string,
    //     periodEnd: string,
    //     public licenseQuantity: number,
    //     public planAmount: number,
    //     public billingScheme: string,
    //     public cancelAtPeriodEnd: boolean){
    //         if(periodEnd)
    //         {
    //             let ymd = periodEnd.substr(0, periodEnd.indexOf("T")).split("-");
    //             this.periodEndDate = new Date(+ymd[0], (+ymd[1])-1, +ymd[2]);
    //         }

    //         this.isActive = status == 'active' || status == 'trialing';
    //     }
}

export class BillingInformation {
    constructor(public addressLine1: string,
                public addressLine2: string,
                public city: string,
                public state: string,
                public zip: string,
                public phone: string){}
    }

export class ProductPlan {
    public id: string;
    public name: string;
    public amount: number;
    public billingScheme: string;
}

export class SetProductPlanRequest{
    constructor(public planId: string){        
    }
}

export class DefaultPaymentSourceInformation{
    public brand: string;
    public last4: string;
    public expirationMonth: number;
    public expirationYear: number;   
}

export class SubscriptionDetails{
    public productName: string;
    public isActive: boolean;
    public isTrial: boolean;
    public daysLeft: number;
    public cancelAtPeriodEnd: boolean;
    public currentPeriodEnd: Date;
    public hasDefaultPaymentMethod: boolean;
    public defaultPaymentMethod: string;
}

export enum SubscriptionPaymentSource{
    DefaultSource = 0,
    NewSource = 1
}