import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationExtras
} from '@angular/router';
import { AuthNavigationService } from './auth-navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguradService implements CanActivate {

  constructor(private auth_navigation: AuthNavigationService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth_navigation.hasUserInfo()) {
      this.auth_navigation.redirectToLogin();
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NonAuthgurad implements CanActivate {

  constructor(private auth_navigation: AuthNavigationService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth_navigation.hasUserInfo()) {
      this.auth_navigation.redirectToHome();
      return false;
    }
    return true;
  }
}
