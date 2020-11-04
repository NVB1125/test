import { Injectable, Inject, forwardRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from './global.service'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthNavigationService {

  private userInfo: any;
  constructor(private globals: GlobalService, private router: Router) {
    this.globals.user$.subscribe(dataInfo => this.userInfo = dataInfo);
  }
  public hasUserInfo(): boolean {
    return this.userInfo ? true : false
  }
  /**
   * Used to redirect to dashobard page
   */
  public redirectToHome() {
    if (this.userInfo.role == 'admin') {
      this.router.navigateByUrl('/app/admin/dashboard');
    }
    else if (this.userInfo.role == 'user') {
      this.router.navigateByUrl('/app/admin/dashboard');
    }
    else {
      this.router.navigateByUrl('/app/admin/dashboard');
    }
  }
  /**
   * Used to redirect to unauthorized page
   */
  public redirectToLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
