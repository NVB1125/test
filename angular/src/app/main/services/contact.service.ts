import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from './constant.service';
import { filter, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CommonHttpService } from './common-http.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends CommonHttpService {

  constructor(private http: HttpClient) {
    super()
  }
  // public contactRequest(name, email, phone, content) {
  //   return this.http.post(this.cs.getApiUrl(this.cs.contactRequest), {name, email, phone, content}).pipe(
  //     map((Response) => { return Response }),
  //     catchError(this.handleError)
  //   );
  // }
}
