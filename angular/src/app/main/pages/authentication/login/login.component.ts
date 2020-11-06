import { Component, OnInit, ViewEncapsulation, ViewChild ,ElementRef} from "@angular/core";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { GlobalService } from "../../../services/global.service";
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';


@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})


export class LoginComponent implements OnInit {
  auth2: any;
  @ViewChild('ingoogle', {static: true }) img: ElementRef;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loginForm: FormGroup;

  process = ""

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private authSerivice: AuthService,
    private gs: GlobalService,
    private _snackBar: MatSnackBar
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        toolbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        sidepanel: {
          hidden: true,
        },
      },
    };
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
    this.googleSDK();
    this.fbLibrary();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  //
  prepareLoginImg() { 
    this.auth2.attachClickHandler(this.img.nativeElement, {},
      (googleUser) => {   
        this.router.navigate(['/dashboard']);
        // let profile = googleUser.getBasicProfile();
        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
        // console.log('ID: ' + profile.getId());
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
       
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
   
  }   
  googleSDK() { 
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '743239126098-63c2keqbg7iim40u9c62ovqs2enflvcb.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginImg();
      });
    }
   
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
   
  } 
  fbLibrary() { 
    
    (window as any).fbAsyncInit = function() {
        window['FB'].init({
        appId      : '869805000070130',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
        });
        window['FB'].AppEvents.logPageView();
    };
    
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    
  }
  loginfacebook() {

      window['FB'].login((response) => {
          console.log('login response',response);
          if (response.authResponse) {
    
            window['FB'].api('/me', {
              fields: 'last_name, first_name, email'
            }, (userInfo) => {    
              // console.log("user information");
              // console.log(userInfo);
              this.router.navigate(['/dashboard'])
            });
              
          } else {
            console.log('User login failed');
          }
      }, {scope: 'email'});
  }

  /**
   * On init
   */  

  loginBtn(): void {
    this.process = 'sending';
    this.authSerivice
      .getAccessToken({
        user: {
          email: this.loginForm.get("email").value,
          password: this.loginForm.get("password").value,
        },
      })
      .subscribe(
        (data) => {
          console.log("data1", data)
          if (data["user"]["token"]) {
            localStorage.setItem("currentuser", JSON.stringify(data["user"]));
            this.gs.setUserDetails(data["user"]);
            if (data["user"]["role"] === "admin") {
              this.router.navigate(["/admin"]);
            } else {
              this.router.navigate(["/dashboard"]);
            }
          } else {
            console.log("data", data)
          }
        },
        (error) => {
          this.process = 'done';
          console.log("error", error);
          this._snackBar.open('Email or Password is invalid', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      );
  }
}
