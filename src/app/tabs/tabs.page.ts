import { Component } from '@angular/core';
import {TcLoginService} from '../services/tc-login.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private tcLogin: TcLoginService, private router: Router, private route: ActivatedRoute) {}

  public logout() {
    const logout$ = this.tcLogin.logout();
    logout$.subscribe(
        next => {
          this.router.navigate(['login'], {queryParams: {}});
        }
    );
  }

}
