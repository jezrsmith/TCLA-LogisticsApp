import {
  Component,
  OnInit,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthInfo, LoginContext} from '../models/tc-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  // handle login
  handleLogin = (loginContext: AuthInfo) => {
    const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    // redirect
    console.log('Login: logged in - redirect to ');
    console.log(returnUrl);
    this.router.navigate([returnUrl], {queryParams: {}});
  }

  ngOnInit() {
  }

}
