import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
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

    constructor(private httpClient: HttpClient) {

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

        return this.httpClient.get(api)
            .map(response => {
                return response["data"].map(item => {
                    return new CalendarJob(
                        item.id,
                        item.number,
                        item.name,
                        item.type,
                        item.notes
                    );
                })
            });
    }

    getJobsForWeek(date: Date): Observable<Map<Date, CalendarJob[]>> {

        let api = `${environment.webServiceUrl}/api/job/getJobsForWeek?date=${date.toISOString()}`

        return this.httpClient.get(api)
            .map(response => {
                let jobs: CalendarJob[] = [];
                return response["data"].map(item => {
                    item.key, item.value.map(value => {
                        return new CalendarJob(
                            value.id,
                            value.number,
                            value.name,
                            item.type,
                            item.notes
                        );
                    })
                })
            });
    }

    getJobsForMonth(date: Date): Observable<CalendarJob[]> {

        let api = `${environment.webServiceUrl}/api/job/getJobsForMonth?date=${date.toISOString()}`

        return this.httpClient.get(api)
            .map(response => {
                let jobs: CalendarJob[] = [];
                return response["data"].map(item => {
                    return new CalendarJob(
                        item.id,
                        item.number,
                        item.name,
                        item.type,
                        item.notes
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

    moveWorkerToJob(workerId: string, jobId?: string, date?: Date){

        var body = {
            idJob: jobId, 
            idWorker: workerId,
            date: date.toISOString()
        };

        return this.httpClient.post(this.serviceUri+`/moveWorkerToJob`, body, {headers: this.headers}  ).shareReplay();
    }

    saveNotes( jobId: string, notes: string){
        return this.httpClient.post(this.serviceUri+`/saveNotes/${jobId}`, JSON.stringify(notes), {headers: this.headers}).shareReplay();
    }
}