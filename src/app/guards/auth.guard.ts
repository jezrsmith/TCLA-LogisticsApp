// This guard will redirect to login when not authenticated against live apps.
// If hosted on Tibco cloud it will not be used since Tibco Cloud/Live Apps WRP resources are protected anyway.

// session is detected if API called in last 30 mins (checks local sessionTimestamp)
// alternative way to achieve this would be to make an API call - eg) live apps claims call

// NOTE: assumes the login route is /login

import {Inject, Injectable} from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      // use the sessionTimestamp to decide whether to redirect to login (30 mins expiry of token if no API call)
      const tcsTimestamp = sessionStorage.getItem('tcsTimestamp');
      if (tcsTimestamp && Number(tcsTimestamp) > (Number(Date.now()) - (30 * 60000))) {
        // logged in and api called made in last 30 mins so should be OK
        console.log('AuthGuard: already logged in');
        return true;
      } else {
        // not logged in so redirect to login page
        console.log('AuthGuard: redirect to login');
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      }
    }
}
