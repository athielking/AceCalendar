import {Component, Input} from '@angular/core'
import {ActivatedRoute, Router, ParamMap} from '@angular/router'

@Component({
    selector: "ac-worker-detail",
    templateUrl: "./worker-detail.component.html"
})
export class WorkerDetailComponent {
    public workerId: string;
    
    constructor(
        public route: ActivatedRoute, 
        public router: Router,
    ){
    }
}