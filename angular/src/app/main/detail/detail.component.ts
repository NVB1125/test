import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector   : 'detail',
    templateUrl: './detail.component.html',
    styleUrls  : ['./detail.component.scss']
})
export class DetailComponent implements OnInit
{
    userinfo: any;
    private _stop$: Subject<any>;
    postid: any;
    postSrc: any = []
    postDetail: any = {};
    isAdd: boolean = false
    comment: any

    constructor(
        private _fuseConfigService: FuseConfigService,
        public gs: GlobalService,
        public domSanitizer: DomSanitizer,
        public route: ActivatedRoute
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
        this.postid = this.route.snapshot.paramMap.get("id");
        this.postDetail['comments'] = []
    }

    ngOnInit() {
        this.gs.user$.pipe(filter((userinfo) => !!userinfo), takeUntil(this._stop$)).subscribe((userinfo) => {
            this.userinfo = userinfo
            console.log("userinfoDetail: ", userinfo)
        })
        this.getPostDetail()
    }

    getPostDetail() {
        this.gs.getPostDetail(this.postid).subscribe((res: any) => {
            console.log("getPostDetail: ", res)
            this.postDetail = res.post
            this.postDetail.comments.forEach(element => {
                element.created_time = new Date(element.created_time).toLocaleString()
            });
            res.files.forEach((element, i) => {
                let TYPED_ARRAY = new Uint8Array(element.data);
                console.log("type", TYPED_ARRAY)
                const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                    return data + String.fromCharCode(byte);
                }, '');
                let base64String = btoa(STRING_CHAR);
                this.postSrc[i] = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
            });
        })
    }

    addComment() {
        this.isAdd = true
    }

    cancel() {
        this.isAdd = false
    }

    submit() {
        this.isAdd = false
        this.gs.addComment(this.postid, this.comment).subscribe(res => {
            console.log("addComment: ", res)
            this.comment = ""
            this.getPostDetail()
        })
    }

    ngOnDestroy(): void {
        this._stop$.next();
        this._stop$.complete();
    }
    
}
