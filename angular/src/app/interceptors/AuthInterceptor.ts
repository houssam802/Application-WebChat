import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor{

    constructor(private authenticationService : AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {

        const token: string = localStorage.getItem('token')!;
        //const estApiUrl = request.url.startsWith(environment.apiUrl);
        
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });// This clones Httprequestuest and Authorization header with Bearer token added
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
            request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
            // Requet avec l'entête authorisation
            return next.handle(request);
        } else {
            // Requet sans l'entête authorisation
            return next.handle(request).pipe(
                catchError((error: HttpErrorResponse) => {
                    // Catching Error Stage
                    if (error && error.status === 401) {
                        console.log("ERROR 401 UNAUTHORIZED") 
                    }
                    const err = error.error.message || error.statusText;
                    return throwError(error);                  
                })
            );
        }

    }

}