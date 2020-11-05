import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild ,ElementRef} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { GlobalService } from '../../../services/global.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
    auth2: any;
   @ViewChild('ingoogle', {static: true }) img: ElementRef;
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    registerForm: FormGroup;

    process = ""

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private gs: GlobalService,
        private _snackBar: MatSnackBar
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.registerForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            role: ['user'] // here normal user only created            
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
            this.googleSDK();
            this.fbLibrary();
    }

    prepareLoginImg() { 
        this.auth2.attachClickHandler(this.img.nativeElement, {},
          (googleUser) => {   
            let profile = googleUser.getBasicProfile();
            console.log('Token || ' + googleUser.getAuthResponse().id_token);
            console.log('ID: ' + profile.getId());
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
            //YOUR CODE HERE
          }, (error) => {
            alert(JSON.stringify(error, undefined, 2));
          });
       
      }   
    googleSDK() { 
    window['googleSDKLoaded'] = () => {
        window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
            client_id: '188637199174-dnm6dm1r7k652d8ddqd122kgas9kho3e.apps.googleusercontent.com',
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
     
                console.log("user information");
                console.log(userInfo);
              });
               
            } else {
              console.log('User login failed');
            }
        }, {scope: 'email'});
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createAccountBtn(): void {
        this.process = 'sending';
        let email = this.registerForm.get('email').value;
        this.authService.createUser({
            "user": {
                "username": this.registerForm.get('name').value,
                "email": this.registerForm.get('email').value,
                "password": this.registerForm.get('password').value,
                "role": this.registerForm.get('role').value
            }
        }).subscribe(data => {
            this.router.navigate(['/auth/register-success'],{ queryParams: {email: email}});
        },
        (error) => {
            this.process = 'done';
            console.log("error", error);
            this._snackBar.open('Email is exist', 'Entendido', {
              duration: 3000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          }
        )
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
