/**
 * @ngdoc component
 * @name tcLoginService
 *
 * @description
 *
 * tcLoginService provides services for authenticating against Tibco Subscriber cloud and authorizing with the various
 * Tibco Cloud tenants such as liveapps.
 *
 * These services and related components are typically used when the UI is NOT running on Live Apps WRP/Tibco Cloud
 * When deployed to Live Apps WRP authentication is handled by Tibco Cloud when accessing the protected WRP URL
 *
 *
 */


import { Injectable } from '@angular/core';
import {AccessToken, AuthInfo} from '../models/tc-login';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {Location} from '@angular/common';
import { HTTP } from '@ionic-native/http/ngx';
import {of} from 'rxjs/internal/observable/of';
import {from} from 'rxjs/internal/observable/from';

export const EMAIL_ID_KEY = 'tcs-login-email-id';
export const CLIENT_ID_KEY = 'tcs-login-client-id';
export const OAUTH_URL = 'https://sso-ext.tibco.com';
export const LIVE_APPS_URL = 'https://eu.liveapps.cloud.tibco.com';

@Injectable({
  providedIn: 'root'
})

export class TcLoginService {
  constructor(private nativeHttp: HTTP, private http: HttpClient, private location: Location) { }

  public loginNativeV3(username, password, clientID): Observable<AuthInfo> {
      const body = {
          Email: username,
          Password: password,
          TenantId: 'bpm',
          ClientID: clientID
      };
      return from(this.nativeHttp.post(LIVE_APPS_URL + '/idm/v3/login-oauth', body, { 'Content-Type': 'application/x-www-form-urlencoded' })
        .then(data => {
          sessionStorage.setItem('tcsTimestamp', Date.now().toString());
          return data.data;
        })
    );
  }

  public logout(): Observable<string> {
      sessionStorage.removeItem('tcsTimestamp');
      return of('loggedOut');
  }
}
