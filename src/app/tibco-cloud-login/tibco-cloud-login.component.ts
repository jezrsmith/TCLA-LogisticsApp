import {Component, EventEmitter, Output} from '@angular/core';
import {TcLoginService} from '../services/tc-login.service';
import {AccountsInfo, AuthInfo} from '../models/tc-login';
import {TcOrganizationService} from '../services/tc-organization.service';

/**
 * This component will attempt to log the user in.
 *
 * ![alt-text](../Cloud-Login.png "Image")
 *
 *  @example <tc-tibco-cloud-login (loggedIn)="handleLoggedIn($event)"></tc-tibco-cloud-login>
 */
@Component({
    selector: 'tc-tibco-cloud-login',
    templateUrl: './tibco-cloud-login.component.html',
    styleUrls: ['./tibco-cloud-login.component.scss']
})

export class TibcoCloudLoginComponent {

  /**
   * Notify parent that user is logged in ok.
   */
  @Output() loggedIn: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>();

    name: string;
    password: string;
    clientId: string;
    loggingIn = false;
    loginError: string;

  /**
  * The Constructor creates the Login Dialog
  */
  constructor(
    private tcLogin: TcLoginService,
    private tcOrg: TcOrganizationService
  ) {

  }

  claims() {
      const claims$ = this.tcOrg.getClaimsNative();
      claims$.subscribe(
          next => {
              console.log(next);
          },
          error1 => {
              console.error(error1);
          }
      );
  }

  login(form) {
        this.loginError = undefined;
        this.loggingIn = true;
        console.log('Logging in with: ', (form.email.value + form.password.value + form.clientId.value));
        const auth$ = this.tcLogin.loginNativeV3(form.email.value, form.password.value, form.clientId.value);
        auth$.subscribe(next => {
            this.loggingIn = false;
            // ok logged in
            console.log('User logged in...');
            this.loggedIn.emit(new AuthInfo().deserialize(next));
          },
          error => {
              this.loggingIn = false;
              const err: any = JSON.parse(error.error);
              this.loginError = err.errorMsg;
              console.error('Login Failed: ');
              console.error(err);
          });
    }
}
