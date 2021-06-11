import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor{

    private refreshingInProgress !: boolean;
    private accessTokenSubject = new BehaviorSubject<any>(null);

    constructor(private authService : AuthService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {

        const accessToken: string = localStorage.getItem('token')!;
        
        return next.handle(this.addAuthorizationHeader(request, accessToken)).pipe(
            catchError( err => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    // get refresh tokens
                    console.log("401");
                    const refreshToken = localStorage.getItem('refreshToken');
        
                    // if there are tokens then send refresh token request
                    if (refreshToken) {
                        return this.refreshToken(request, next);
                    }
                    
                    // otherwise logout and redirect to login page
                    return this.logoutAndRedirect(err);
                }
        
                // in case of 403 http error (refresh token failed)
                if (err instanceof HttpErrorResponse && err.status === 403) {
                    
                    return this.logoutAndRedirect(err);

                }
                // if error has status neither 401 nor 403 then just return this error
                return throwError(err);
            })
        );

    }

    private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
        if (token) {
          return request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
        }
    
        return request;
    }


    private logoutAndRedirect(err: any): Observable<HttpEvent<any>> {
        this.authService.logout();
        this.router.navigateByUrl('/');
    
        return throwError(err);
    }
    
    private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshingInProgress) {
        this.refreshingInProgress = true;
        this.accessTokenSubject.next(null);

        return this.authService.refreshToken().pipe(
            switchMap((res) => {
                this.refreshingInProgress = false;
                this.accessTokenSubject.next(res.accessToken);
                // repeat failed request with new token
                return next.handle(this.addAuthorizationHeader(request, res.accessToken));
            })
        );
    } else {
        // wait while getting new token
        return this.accessTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token : any) => {
            // repeat failed request with new token
            return next.handle(this.addAuthorizationHeader(request, token));
        }));
    }
    }

}