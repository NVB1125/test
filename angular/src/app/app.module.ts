import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";
import { MatProgressSpinnerModule } from "@angular/material";
import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from "@fuse/components";

import { fuseConfig } from "app/fuse-config";

import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { AppInit } from "./main/services/app.init.service";
import { AuthguradService, NonAuthgurad } from "./main/services/authgurad.service";
import { HttpInterceptorService } from "./main/services/http-interceptor.service";
import { PagesModule } from "./main/pages/pages.module";
import { DashboardComponent } from "./main/dashboard/dashboard.component";
import { DemoMaterialModule } from "./main/material-module";
import { NewPostComponent } from './main/new-post/new-post.component';
import { UploadFileComponent } from './main/new-post/upload-file/upload-file.component';
import { DragDropDirective } from './drag-drop.directive';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';
import { DetailComponent } from './main/detail/detail.component';


const appRoutes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "new-post",
    component: NewPostComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "detail/:id",
    component: DetailComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "",
    redirectTo: "/auth/login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "errors/error-404",
    pathMatch: "full",
  },
];
export function loadApp(initApp: AppInit) {
  return () => initApp.load();
}

@NgModule({
  declarations: [
    AppComponent, 
    DashboardComponent,
    NewPostComponent,
    DragDropDirective,
    UploadFileComponent,
    DetailComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadApp,
      deps: [AppInit], // before loading app set user info
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true, // http intercepters
    }
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot(),

    // Fuse modules
    FuseModule.forRoot(fuseConfig),
    FuseProgressBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
    MatProgressSpinnerModule,

    // App modules
    LayoutModule,
    PagesModule,
    RouterModule.forRoot(appRoutes),
    DemoMaterialModule,
    AutosizeModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
