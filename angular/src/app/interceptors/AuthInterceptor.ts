import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor{

    constructor(private authenticationService : AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {

        const accessToken: string = this.authenticationService.getToken();
        
        request = request.clone({
            setHeaders: {
                'Content-Type': 'application/json; charset=utf-8',
                Accept: 'application/json'
            }
        });
        
        if (accessToken) {
            const authenticatedRequest = request.clone({
                headers: request.headers.set(
                'Authorization',
                `Token token=${accessToken}`
                )
            });
            // Requet avec l'entête authorisation
            return next.handle(authenticatedRequest);
        } else {
            // Requet sans l'entête authorisation
            return next.handle(request);
        }

    }

}