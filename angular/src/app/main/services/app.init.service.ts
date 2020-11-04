import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthService } from "./auth.service";
import { GlobalService } from "./global.service";

@Injectable({
  providedIn: "root",
})
export class AppInit {
  constructor(
    private authService: AuthService,
    private globalService: GlobalService,
    private readonly _http: HttpClient
  ) {}

  load() {
    const userDetail = JSON.parse(localStorage.getItem("currentuser"));
    return new Promise((resolve, reject) => {
        this.globalService.setUserDetails(userDetail);
        resolve(true);
    });
  }
}
