import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarJob } from '../components/calendar/common/models';
import { Observable } from 'rxjs/Rx';
import * as isSameDay from 'date-fns/is_same_day';

@Injectable()
export class JobService{

    constructor(private http: Http,
                private httpClient: HttpClient){
    }

    getJobs(): Observable<CalendarJob[]>{

        let api = `${environment.webServiceUrl}/api/job`
        
        return this.httpClient.get(api)
            .map(json =>{
                return (<CalendarJob[]>json['data'])
            });
    }
    
    getJobsForDay(date: Date): Observable<CalendarJob[]> {

        let api = `${environment.webServiceUrl}/api/job/getJobsForDay?date=${date.toISOString()}`
    
        return this.http.get(api)
            .map(response => {
                let jobs: CalendarJob[] = [];
                return response.json().data.map(item => {
                    return new CalendarJob(
                        item.id, 
                        item.number,
                        item.name,
                        item.type
                    );
                })
            });
    }

    getJobsForWeek(date: Date): Observable<Map<Date,CalendarJob[]>> {

        let api = `${environment.webServiceUrl}/api/job/getJobsForWeek?date=${date.toISOString()}`
    
        return this.http.get(api)
            .map(response => {
                let jobs: CalendarJob[] = [];
                return response.json().data.map(item => {
                    item.key, item.value.map(value => {
                        return new CalendarJob(
                            value.id, 
                            value.number,
                            value.name,
                            item.type
                        );
                    })
                })
            });
    }

    getJobsForMonth(date: Date): Observable<CalendarJob[]> {

        let api = `${environment.webServiceUrl}/api/job/getJobsForMonth?date=${date.toISOString()}`
    
        return this.http.get(api)
            .map(response => {
                let jobs: CalendarJob[] = [];
                return response.json().data.map(item => {
                    return new CalendarJob(
                        item.id, 
                        item.number,
                        item.name,
                        item.type
                    );
                })
            });
    }

    addJob(job: CalendarJob) {
        let api = `${environment.webServiceUrl}/api/job`;

        var headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this.http.post(api, JSON.stringify(job),{headers}).share();
    }
}