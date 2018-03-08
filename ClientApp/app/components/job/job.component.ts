import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import { List } from 'immutable';

import { JobStore } from '../../stores/job.store';
import { CalendarJob } from '../calendar/common/models';
import { AddJobComponent } from './addJob.component';
//import { AddWorkerComponent } from './addWorker.component';

@Component({
    selector: "ac-job",
    templateUrl: "./job.component.html"
})
export class JobComponent implements OnInit{

    constructor(
        private jobStore: JobStore,
        private loadingService: TdLoadingService,
        private dialog: MatDialog
    ) {
    }

    jobsLoading : boolean = true;
    jobs: CalendarJob[];
    filteredJobs : BehaviorSubject<List<CalendarJob>> = new BehaviorSubject<List<CalendarJob>>(List([]));

    ngOnInit(){
        this.jobStore.jobs.subscribe( result => {
            this.jobs = result
            this.filterJobs('');

            this.jobsLoading = false;
        })

        this.jobStore.getJobs();
    }

    filterJobs(searchString: string = ''): void {
        this.filteredJobs.next( 
            List(this.jobs.filter( (job: CalendarJob) => {
                return (job.number.toString() + job.name.toLowerCase()).indexOf(searchString.toLowerCase()) > -1;
        })));
      }
    
    showAddJobForm(): void {
        // let dialogRef = this.dialog.open(AddJobComponent, {
        //     disableClose: true
        //   });
      
        //   dialogRef.afterClosed().subscribe(result => {
        //     //this.load();
        //   });
    }

    delete(jobId: string){
        this.jobStore.deleteJob(jobId)
            .subscribe(result => {
                console.log(`Job Deleted: ${jobId}`)
            });
    }
}