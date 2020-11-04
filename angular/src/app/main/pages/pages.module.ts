import { NgModule } from '@angular/core';

import { LoginModule } from 'app/main/pages/authentication/login/login.module';
import { RegisterModule } from 'app/main/pages/authentication/register/register.module';
import { ForgotPasswordModule } from 'app/main/pages/authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';
import { MailConfirmModule } from 'app/main/pages/authentication/mail-confirm/mail-confirm.module';
import { Error404Module } from 'app/main/pages/errors/404/error-404.module';
import { Error500Module } from 'app/main/pages/errors/500/error-500.module';

@NgModule({
    imports: [
        // Authentication
        LoginModule,
        RegisterModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        MailConfirmModule,
        // Errors
        Error404Module,
        Error500Module,
    ]
})
export class PagesModule
{

}
