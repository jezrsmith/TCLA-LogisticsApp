import {Component, EventEmitter, Output} from '@angular/core';
import {TcLoginService} from '../services/tc-login.service';
import {AccountsInfo, AuthInfo, Credentials} from '../models/tc-login';
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
    savedCredentials: any;
    public passInputType = 'password';
    public clientIdInputType = 'password';

  /**
  * The Constructor creates the Login Dialog
  */
  constructor(
    private tcLogin: TcLoginService,
    private tcOrg: TcOrganizationService
  ) {
      const savedCredentials: Credentials = localStorage.getItem('reportingApp_Credentials') ? JSON.parse(localStorage.getItem('reportingApp_Credentials')) : undefined;
      if (savedCredentials.username && savedCredentials.username !== '') {
          this.name = savedCredentials.username;
      }
      if (savedCredentials.clientId  && savedCredentials.clientId !== '') {
          this.clientId = savedCredentials.clientId;
      }
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

    public toggleVisible(inpAttr: string) {
        if (this[inpAttr] === 'password') {
            this[inpAttr] = 'text';
        } else {
            this[inpAttr] = 'password';
        }
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
            // save credentials
            localStorage.setItem('reportingApp_Credentials', JSON.stringify(new Credentials().deserialize(
                {
                    username: this.name,
                    clientId: this.clientId
                }
            )));
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
