import { Component, HostBinding, Input } from "@angular/core";
import { GlobalService } from "app/main/services/global.service";
import { Router } from "@angular/router";

@Component({
  selector: "fuse-nav-horizontal-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"],
})
export class FuseNavHorizontalItemComponent {
  @HostBinding("class")
  classes = "nav-item";

  @Input()
  item: any;

  adminFlag = false;
  loginFlag = false;

  /**
   * Constructor
   */
  constructor(private gs: GlobalService, private router: Router) {
    this.gs.user$.subscribe((userInfo) => {
      if (userInfo) {
        if (userInfo["role"] === "admin") {
          this.adminFlag = true;
        } else {
          this.adminFlag = false;
        }
        this.loginFlag = true;
      }
    });
  }
}
