import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector   : 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls  : ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
    userinfo: any;
    private _stop$: Subject<any>;
    postSrc: any = []
    posts: any = []
    search: any = "";

    constructor(
        private _fuseConfigService: FuseConfigService,
        public gs: GlobalService,
        public domSanitizer: DomSanitizer,
        public router: Router
    )
    {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this._stop$ = new Subject();
    }

    ngOnInit() {
        this.gs.user$.pipe(filter((userinfo) => !!userinfo), takeUntil(this._stop$)).subscribe((userinfo) => {
            this.userinfo = userinfo
            console.log("userinfoDashboard: ", userinfo)
            this.getPost()
        })
    }

    getPost() {
        this.gs.getPost().subscribe((res: any) => {
            console.log("getPost: ", res)
            this.posts = res.posts
            res.files.forEach((element, i) => {
                let TYPED_ARRAY = new Uint8Array(element.data);
                console.log("type", TYPED_ARRAY)
                const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                    return data + String.fromCharCode(byte);
                }, '');
                let base64String = btoa(STRING_CHAR);
                this.postSrc[i] = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
            });
            this.filter()
        })
    }

    postDetail(index) {
        console.log("postDetail: ", this.posts[index])
        this.router.navigate(['/detail/' + this.posts[index]._id])
    }

    filter() {
        this.posts.forEach(element => {
            console.log("ellemet: ", element, this.search)
            if (element.description.includes(this.search)) {
                element['isInclude'] = true
            } else {
                element['isInclude'] = false
            }
        });
    }

    ngOnDestroy(): void {
        this._stop$.next();
        this._stop$.complete();
    }
    
}
