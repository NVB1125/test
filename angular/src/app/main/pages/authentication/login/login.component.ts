import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

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
