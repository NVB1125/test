import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "./constant.service";
import { filter, map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { CommonHttpService } from "./common-http.service";

@Injectable({
  providedIn: "root",
})
export class AuthService extends CommonHttpService {
  userDetail;
  constructor(private http: HttpClient, private cs: ConstantService) {
    super();
    this.userDetail = JSON.parse(sessionStorage.getItem("currentuser"));
  }

  // api call to get token and user detail
  public getAccessToken(obj) {
    return this.http.post(this.cs.getApiUrl(this.cs.getaccesstoken), obj).pipe(
      map((Response) => {
        return Response;
      }),
      catchError(this.handleError)
    );
  }
  /**
   * @description used to create user details
   * @param data
   */
  public createUser(data) {
    return this.http.post(this.cs.getApiUrl(this.cs.createUser), data).pipe(
      map((Response) => {
        return Response;
      }),
      catchError(this.handleError)
    );
  }
  /**
   * @description used to sendResetPasswordLink details
   * @param data
   */
  public sendResetPasswordLink(data) {
    return this.http
      .post(this.cs.getApiUrl(this.cs.resetPasswordLink), data)
      .pipe(
        map((Response) => {
          return Response;
        }),
        catchError(this.handleError)
      );
  }
  /**
   * @description used to verifyResetPassword details
   * @param data
   */
  public verifyResetPassword(data) {
    return this.http
      .post(this.cs.getApiUrl(this.cs.verifyPasswordLink), data)
      .pipe(
        map((Response) => {
          return Response;
        }),
        catchError(this.handleError)
      );
  }
  /**
   * @description used to resetNewPassword details
   * @param data
   */
  public setNewPassword(data) {
    return this.http
      .post(this.cs.getApiUrl(this.cs.resetNewPassword), data)
      .pipe(
        map((Response) => {
          return Response;
        }),
        catchError(this.handleError)
      );
  }
  /**
   * @description used to resetNewPassword details
   * @param data
   */
  public verifyEmail(data) {
    return this.http.post(this.cs.getApiUrl(this.cs.verifEmail), data).pipe(
      map((Response) => {
        return Response;
      }),
      catchError(this.handleError)
    );
  }
}
