import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '@fuse/shared.module';

import { Error404Component } from 'app/main/pages/errors/404/error-404.component';
import { AuthguradService } from 'app/main/services/authgurad.service';

const routes = [
    {
        path     : 'errors/error-404',
        component: Error404Component,
        canActivate: [AuthguradService]
    }
];

@NgModule({
    declarations: [
        Error404Component
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class Error404Module
{
}
