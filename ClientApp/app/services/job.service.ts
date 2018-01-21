import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarJob, AddJobModel } from '../components/calendar/common/models';
import { Observable } from 'rxjs/Rx';
import * as isSameDay from 'date-fns/is_same_day';

@Injectable()
export class JobService {

    private serviceUri: string;
    private headers = new HttpHeaders(
        {
            'Content-Type': 'application/json'
        });

    constructor(private http: Http,
        private httpClient: HttpClient) {

        this.serviceUri = `${environment.webServiceUrl}/api/job`
    }

    getJobs(): Observable<CalendarJob[]> {

        return this.httpClient.get(this.serviceUri)
            .map(json => {
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

    getJobsForWeek(date: Date): Observable<Map<Date, CalendarJob[]>> {

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

    addJob(job: AddJobModel) {


        return this.httpClient.post<CalendarJob>(this.serviceUri, job, { headers: this.headers }).shareReplay();

    }

    deleteJob( jobId: string ){
        return this.httpClient.delete( this.serviceUri + `/${jobId}` ).shareReplay();
    }

    moveWorkerToJob(jobId: string, workerId: string, date?: Date){

        var body = {
            idJob: jobId, 
            idWorker: workerId,
            date: date.toISOString()
        };

        return this.httpClient.post(this.serviceUri+`/moveWorkerToJob`, body, {headers: this.headers}  ).shareReplay();
    }
}