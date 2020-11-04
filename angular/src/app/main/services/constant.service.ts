import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ConstantService {
  // authencation releated end points
  public getaccesstoken = "users/login";
  public createUser = "users";
  public resetPasswordLink = "send-reset-password-link";
  public verifyPasswordLink = "verif-token";
  public resetNewPassword = "new-password";
  public verifEmail = "verif-email";
  public getUserInfo = "getUserInfo";
  public newPost = "post/new-post";
  public newPostData = "post/new-post-data";
  public getPost = "post/get-post";
  public addComment = "post/add-comment";

  constructor() {}
  /**
   * @description get api endpoint from base url
   * @param path
   */
  public getApiUrl(path: string) {
    return environment.baseUrl + path;
  }
}
