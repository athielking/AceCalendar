import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarJob, AddJobModel, MoveWorkerRequestModel, SaveNotesRequestModel, JobStartAndEndDate } from '../components/calendar/common/models';
import { Observable } from 'rxjs/Rx';
import * as isSameDay from 'date-fns/is_same_day';

@Injectable()
export class JobService {

    private serviceUri: string;

    constructor(private httpClient: HttpClient) {
        this.serviceUri = `${environment.webServiceUrl}/api/job`
    }

    public getJobs(): Observable<CalendarJob[]> {

        return this.httpClient.get(this.serviceUri)
            .map(json => {
                return (<CalendarJob[]>json['data'])
            });
    }

    public getJobsForDay(date: Date): Observable<CalendarJob[]> {

        let api = `${environment.webServiceUrl}/api/job/getJobsForDay?date=${date.toISOString()}`

        return this.httpClient.get(api)
            .map(response => {
                return response["data"].map(item => {
                    return new CalendarJob(
                        item.id,
                        item.number,
                        item.name,
                        item.notes
                    );
                })
            });
    }

    public getJobsForWeek(date: Date): Observable<Map<Date, CalendarJob[]>> {

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
                            item.notes
                        );
                    })
                })
            });
    }

    public getJobsForMonth(date: Date): Observable<CalendarJob[]> {

        let api = `${environment.webServiceUrl}/api/job/getJobsForMonth?date=${date.toISOString()}`

        return this.httpClient.get(api)
            .map(response => {
                let jobs: CalendarJob[] = [];
                return response["data"].map(item => {
                    return new CalendarJob(
                        item.id,
                        item.number,
                        item.name,
                        item.notes
                    );
                })
            });
    }

    public addJob(addJobModel: AddJobModel) {
        return this.httpClient.post(this.serviceUri, addJobModel).shareReplay();
    }

    public editJob( jobId: string, addJobModel: AddJobModel){
        return this.httpClient.put( this.serviceUri + `/${jobId}`, addJobModel ).shareReplay();
    }
    public deleteJob( jobId: string ){
        return this.httpClient.delete( this.serviceUri + `/${jobId}` ).shareReplay();
    }

    public moveWorkerToJob(moveWorkerRequestModel: MoveWorkerRequestModel){
        return this.httpClient.post(this.serviceUri+`/moveWorkerToJob`, moveWorkerRequestModel).shareReplay();
    }

    public moveWorkerToAvailable(moveWorkerRequestModel: MoveWorkerRequestModel) {
        return this.httpClient.post(this.serviceUri+`/moveWorkerToAvailable`, moveWorkerRequestModel ).shareReplay();
    }

    public moveWorkerToOff(moveWorkerRequestModel: MoveWorkerRequestModel) {
        return this.httpClient.post(this.serviceUri+`/moveWorkerToOff`, moveWorkerRequestModel ).shareReplay();
    }

    public saveNotes( jobId: string, saveNotesRequestModel: SaveNotesRequestModel){
        return this.httpClient.post(this.serviceUri+`/saveNotes/${jobId}`, saveNotesRequestModel ).shareReplay();
    }

    public getJobStartAndEndDate(jobId: string) {
        return this.httpClient.get(this.serviceUri+`/getJobStartAndEndDate?jobId=${jobId}`)
            .map(response => {
                return new JobStartAndEndDate(
                    new Date(response["data"].startDate),
                    new Date(response["data"].endDate)
                );
            });
    }
}