import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '@fuse/shared.module';

import { MailConfirmComponent } from 'app/main/pages/authentication/mail-confirm/mail-confirm.component';
import { RegisterSucuessComponent } from './register-sucuess/register-sucuess.component';
import { VerfiyEmailComponent } from './verfiy-email/verfiy-email.component';

const routes = [
    {
        path: 'auth/mail-confirm',
        component: MailConfirmComponent
    },
    {
        path: 'auth/register-success',
        component: RegisterSucuessComponent
    },
    {
        path: 'auth/verify-email',
        component: VerfiyEmailComponent
    }
];

@NgModule({
    declarations: [
        MailConfirmComponent,
        RegisterSucuessComponent,
        VerfiyEmailComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class MailConfirmModule {
}
