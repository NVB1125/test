import { Component, ViewEncapsulation } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-sucuess',
  templateUrl: './register-sucuess.component.html',
  styleUrls: ['./register-sucuess.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RegisterSucuessComponent {

  public email: string;
  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   */
  constructor(
      private _fuseConfigService: FuseConfigService,
      private aroute: ActivatedRoute
  ) {
      // Configure the layout
      this._fuseConfigService.config = {
          layout: {
              navbar: {
                  hidden: true
              },
              toolbar: {
                  hidden: true
              },
              footer: {
                  hidden: true
              },
              sidepanel: {
                  hidden: true
              }
          }
      };
  }
  /**
  * On init
  */
  ngOnInit(): void {
      this.aroute.queryParams.subscribe(params => {
          if (params['email']) {
              this.email = params['email']
          }
      })
  }

}
