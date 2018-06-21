import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ac-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {

  @Input() subscription: Subscription;
  @Output() setupSubscriptionClicked: EventEmitter<any> = new EventEmitter();
  
  constructor(
    private dialog: MatDialog
  ){    
  } 

  public setupSubscription(){
    if(this.setupSubscriptionClicked)
      this.setupSubscriptionClicked.emit(null);
  }
}
