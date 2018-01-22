import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';

import { TOKEN_NAME } from '../services/auth.service';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  public intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = localStorage.getItem(TOKEN_NAME);
        
    const authReq = request.clone({
      headers: request.headers.append(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${token}`)
    });
        
    return next.handle(authReq);
  }
}
