import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
import { CalendarDay, CalendarJob } from '../components/calendar/common/models';
import 'rxjs/Rx';

@Injectable()
export class CalendarService{
    jobs: CalendarJob[];
    workers: Worker[];

    constructor(private http:Http){
        this.jobs = [];
        this.workers = [];
    }

    getJobs(){
        let promise = new Promise((resolve, reject)=>{
            let api = `${environment.webServiceUrl}/jobs`
            this.http.get(api)
                .toPromise()
                .then(
                    res => { // Success
                        this.jobs = res.json().results.map(item => {
                            return new CalendarJob(
                                item.id,
                                item.jobNumber,
                                item.date,
                                item.title
                            );
                        });
                        // this.results = res.json().results;
                        resolve();
                    },
                    msg => { // Error
                        reject(msg);
                    }
                );
        });

        return promise;
    }

    getWorkers(){
        let promise = new Promise((resolve, reject)=>{
            let api = `${environment.webServiceUrl}/workers`
            this.http.get(environment.webServiceUrl)
                .toPromise()
                .then(
                    res => { // Success
                        this.jobs = res.json().results.map(item => {
                            return new CalendarJob(
                                item.id,
                                item.jobNumber,
                                item.date,
                                item.title
                            );
                        });
                        // this.results = res.json().results;
                        resolve();
                    },
                    msg => { // Error
                        reject(msg);
                    }
                );
        });
        
        return promise;
    }
}