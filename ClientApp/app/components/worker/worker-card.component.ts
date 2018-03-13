import {Component, Input} from '@angular/core'

import {Worker} from '../calendar/common/models'
import { Router } from '@angular/router';

@Component({
    selector: "ac-worker-card",
    templateUrl: "./worker-card.component.html",
    styleUrls: ["./worker-card.component.scss"]
})
export class WorkerCardComponent{
    @Input() worker: Worker;
    @Input() scope: string;
    @Input() isReadonly: boolean = false;

    constructor(
        private router: Router
    ) {
    } 

    public viewWorker(worker: Worker){
        this.router.navigate(['worker', worker.id]);
    }
}