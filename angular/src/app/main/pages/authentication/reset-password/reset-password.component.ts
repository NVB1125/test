import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "app/main/services/auth.service";

@Component({
  selector: "reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;

  process = "";

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private aroute: ActivatedRoute,
    private authService: AuthService
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
    this.resetPasswordForm = this._formBuilder.group({
      resettoken: ["", Validators.required],
      password: ["", Validators.required],
      passwordConfirm: ["", [Validators.required, confirmPasswordValidator]],
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.resetPasswordForm
      .get("password")
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.resetPasswordForm.get("passwordConfirm").updateValueAndValidity();
      });
    this.aroute.queryParams.subscribe((params) => {
      if (params["token"]) {
        this.authService
          .verifyResetPassword({ resettoken: params["token"] })
          .subscribe(
            (dat) => {
              this.resetPasswordForm.controls.resettoken.setValue(
                params["token"]
              );
            },
            (error) => {
              this.router.navigateByUrl("/auth/login");
            }
          );
      }
    });
  }
  resetPasswordBtn(): void {
    this.process = 'sending';
    this.authService
      .setNewPassword({
        password: this.resetPasswordForm.get("password").value,
        resettoken: this.resetPasswordForm.get("resettoken").value,
      })
      .subscribe((data) => {
        this.process = 'done';
        this.router.navigate(["/auth/login"]);
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get("password");
  const passwordConfirm = control.parent.get("passwordConfirm");

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === "") {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};
