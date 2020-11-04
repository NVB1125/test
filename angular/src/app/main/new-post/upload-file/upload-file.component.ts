import { Component} from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {

  files: any = [];
  uploadData: any;
  userinfo: any;
  private _stop$: Subject<any>;
  description: any;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  

  constructor(
    public gs: GlobalService,
    private _snackBar: MatSnackBar,
    public router: Router
  ) {
    this._stop$ = new Subject();
    this.gs.user$.pipe(filter((userinfo) => !!userinfo), takeUntil(this._stop$)).subscribe((userinfo) => {
      this.userinfo = userinfo
      console.log("userinfo1: ", userinfo)
    })
  }
  
  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {

      
      const element = event[index];
      if (element.name.substr(element.name.length - 3) == 'jpg' || element.name.substr(element.name.length - 3) == 'png' || element.name.substr(element.name.length - 4) == 'jpeg') {
        this.message(element.name + ' is selected')
        
      } else {
        this.message("Please select .jpg, .jpeg or .png file")
      }
      console.log("element: ", element)
      const reader = new FileReader();
      reader.onload = e => {
        this.files.push({
          name: element.name,
          src: reader.result,
          file: element
        })
      }
      reader.readAsDataURL(element);
      
    }  
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }
  post() {
    this.gs.newPostData(this.description, this.files.length).subscribe((post: any) => {
      console.log("newPostData: ", post)
      this.uploadData = new FormData();
      this.files.forEach((element, i) => {
        if (element.name.substr(element.name.length - 3) == 'jpg') {
          if (i == 0) {
          this.uploadData.append('file[]', element.file, post.post._id + '.jpg');
          } else {
            this.uploadData.append('file[]', element.file, post.post._id + '-' + i + '.jpg');
          }
        } else if (element.name.substr(element.name.length - 3) == 'png') {
          if (i == 0) {
            this.uploadData.append('file[]', element.file, post.post._id + '.png');
          } else {
            this.uploadData.append('file[]', element.file, post.post._id + '-' + i + '.png');
          }
        } else if (element.name.substr(element.name.length - 4) == 'jpeg') {
          if (i == 0) {
            this.uploadData.append('file[]', element.file, post.post._id + '.jpeg');
          } else {
            this.uploadData.append('file[]', element.file, post.post._id + '-' + i + '.jpeg');
          }
        }
        console.log('form data variable :   '+ this.uploadData.toString());
      });
      this.gs.newPost(this.uploadData).subscribe(res => {
        console.log("res", res)
        this.router.navigate(['/dashboard'])
      })
    })
  }
  message (message) {
    this._snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }
}
