import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';

import { StorageService } from '../services/storage.service';
import { StorageKeys } from '../components/calendar/common/calendar-tools';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';
const CALENDAR_HEADER_KEY = 'SelectedCalendar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	
	constructor(private storageService: StorageService){}

	public intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		
		const token = this.storageService.getItem(StorageKeys.tokenName);
		var newHeaders = request.headers.append(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${token}`);

		if(this.storageService.hasItem(StorageKeys.selectedCalendar))
			newHeaders = newHeaders.append(CALENDAR_HEADER_KEY, this.storageService.getItem(StorageKeys.selectedCalendar));

		const authReq = request.clone({
			headers: newHeaders
		});
				
		return next.handle(authReq);
	}
}
