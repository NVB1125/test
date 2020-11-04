import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { filter, map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

export class CommonHttpService {
  constructor() {}
  public handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body["error"] || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return throwError(errMsg);
  }
}
