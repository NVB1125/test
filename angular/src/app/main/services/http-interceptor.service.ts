// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
// import { Observable, of, throwError, Subscriber } from 'rxjs';
// import { catchError, switchMap, flatMap } from "rxjs/operators";
// import { Router } from '@angular/router';
// import { AuthService } from './auth.service';

// @Injectable()
// export class HttpInterceptorService {
//     constructor(private authenticationService: AuthService, private router: Router) { }
//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         // this.loaderService.show();
//         const currentUser = JSON.parse(localStorage.getItem('currentuser'));
//         // To check the Access Token URL
//         if (!currentUser) {
//             request = request.clone({
//                 setHeaders: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//         } else {
//             request = request.clone({
//                 setHeaders: {
//                     Bearer: currentUser.token,
//                     'Content-Type': 'application/json'
//                 }
//             });
//         }
//         return next.handle(request)
//     }
//     private clearSessions(error) {
//         sessionStorage.clear();
//         return throwError(error);
//     }
// }

import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of, throwError, Subscriber } from "rxjs";
import { catchError, switchMap, flatMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class HttpInterceptorService {
  constructor(
    private authenticationService: AuthService,
    private router: Router
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = JSON.parse(localStorage.getItem("currentuser"));
    const headersConfig = {};
    if (user && user.token) {
      headersConfig["Bearer"] = `${user.token}`;
    }

    // if (!req.url.toLowerCase().includes("upload")) {
    //   headersConfig["Content-Type"] = "application/json";
    //   headersConfig["Accept"] = "application/json";
    // }

    const request = req.clone({ setHeaders: headersConfig });
    
    return next.handle(request);
  }

  private clearSessions(error) {
    sessionStorage.clear();
    return throwError(error);
  }
}
