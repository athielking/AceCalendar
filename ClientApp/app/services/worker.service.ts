import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { List } from 'immutable';

import { environment } from '../../environments/environment';
import { Worker, AddWorkerModel, EditTimeOffModel, WorkerDto } from '../components/calendar/common/models';
import { DateRangeModel } from '../models/shared/dateRangeModel';
import { TimeOffGridModel } from '../models/worker/timeOffGridModel';
import { JobByDateGridModel } from '../models/worker/jobByDateGridModel';

@Injectable()
export class WorkerService{

    private serviceUri: string;

    constructor(private httpClient: HttpClient){
        this.serviceUri = `${environment.webServiceUrl}/api/worker`
    }

    public addWorker( addWorkerModel: AddWorkerModel){
        return this.httpClient.post( this.serviceUri, addWorkerModel ).shareReplay();
    }

    public editWorker( workerId: string, addWorkerModel: AddWorkerModel){
        return this.httpClient.put( this.serviceUri + `/${workerId}`, addWorkerModel ).shareReplay();
    }

    public deleteWorker( workerId: string ){
        return this.httpClient.delete( this.serviceUri + `/${workerId}` ).shareReplay();
    }

    public getWorkers(): Observable<WorkerDto[]>{
        return this.httpClient.get(this.serviceUri).map(json => <WorkerDto[]>json['data']);
    }

    public getWorker(id: string): Observable<WorkerDto>{
        return this.httpClient.get(this.serviceUri + `/${id}`).map(json => (<WorkerDto>json['data']));
    }

    public getTimeOffData(workerId: string, date: Date): Observable<TimeOffGridModel[]>{
        return this.httpClient.get(this.serviceUri + `/getTimeOffForMonth?id=${workerId}&date=${date.toISOString()}`).map(json => (<TimeOffGridModel[]>json['data']));
    }

    public getWorkerJobs(workerId: string, date: Date): Observable<JobByDateGridModel[]>{
        return this.httpClient.get(this.serviceUri + `/GetJobsForMonth?id=${workerId}&date=${date.toISOString()}`).map(json => (<JobByDateGridModel[]>json['data']));
    }

    public getAvailable(date: Date, end?: Date): Observable<Worker[]>{

        let api = this.serviceUri+`/getAvailableWorkers?start=${date.toISOString()}`;
        if(end)
            api = api + `&end=${end.toISOString()}`;

        return this.httpClient.get(api)
            .map(json => (<Worker[]>json['data']));
    }

    public editTimeOff(workerId: string, monthDate: Date, timeOffDates: Date[]){
        var editTimeOffModel = new EditTimeOffModel (
            workerId,
            monthDate,
            timeOffDates
        );

        return this.httpClient.post(this.serviceUri+`/editTimeOff`, editTimeOffModel ).shareReplay();
    }

    public deleteTimeOff(workerId: string, date: Date){
        return this.httpClient.delete(this.serviceUri+`/deleteTimeOff?workerId=${workerId}&date=${new Date(date).toISOString()}`).shareReplay();
    }
}