import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector   : 'new-post',
    templateUrl: './new-post.component.html',
    styleUrls  : ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit
{
    userinfo: any;
    private _stop$: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        public gs: GlobalService
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
            console.log("userinfo: ", userinfo)
        })
    }

    ngOnDestroy(): void {
        this._stop$.next();
        this._stop$.complete();
    }
    
}
