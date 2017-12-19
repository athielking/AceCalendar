import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { CalendarJob } from '../components/calendar/common/models';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';
import * as isSameDay from 'date-fns/is_same_day';

@Injectable()
export class JobService{

    constructor(private http: Http){
    }

    getJobs(): Observable<CalendarJob[]>{

        let api = `${environment.webServiceUrl}/jobs`
        
        return this.http.get(api)
            .map(response => (<CalendarJob[]>response.json()));
    }
    
    getJobsForDay(date: Date): Observable<CalendarJob[]> {

        let api = `${environment.webServiceUrl}/jobs`

        return this.http.get(api)
            .map(response => {
                return (response.json().map(item => {
                    return new CalendarJob(
                        item.id, 
                        item.jobNumber, 
                        new Date(item.date),
                        item.title
                    );
                }).filter(job => isSameDay(job.date, date)));
        });
    }

    addJob(job: CalendarJob) {
        let api = `${environment.webServiceUrl}/jobs`;

        var headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this.http.post(api, JSON.stringify(job),{headers}).share();
    }
}