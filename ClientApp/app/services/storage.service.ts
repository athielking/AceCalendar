import {Injectable} from '@angular/core';
import { Subject, Observable } from "rxjs";

@Injectable()
export class StorageService {
    private _storageSub: Subject<string> = new Subject()

    public watchStorage(): Observable<any>{
        return this._storageSub.asObservable();
    }

    public setItem(key: string, data: any){
        localStorage.setItem(key, data);
        this._storageSub.next(key);
    }

    public setJsonItem(key: string, data: any){
        this.setItem(key, JSON.stringify(data));
        this._storageSub.next(key);
    }

    public getItem(key: string)
    {
        return localStorage.getItem(key);
    }

    public getJsonItem(key: string)
    {
        return JSON.parse(this.getItem(key));
    }

    public hasItem(key: string): boolean{
        return !!localStorage.getItem(key);
    }

    public removeItem(key: string)
    {
        localStorage.removeItem(key);
        this._storageSub.next(key);
    }
}