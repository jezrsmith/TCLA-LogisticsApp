import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Claim, UserInfo, UserInfoList} from '../models/tc-organization';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {HTTP} from '@ionic-native/http/ngx';
import { LIVE_APPS_URL } from './tc-login.service';
import {from} from 'rxjs/internal/observable/from';
import {of} from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class TcOrganizationService {

  constructor(private http: HttpClient, private nativeHttp: HTTP) {
  }

  // get primary sandboxId
  public getProdSandboxId(): Observable<string> {
    return this.getClaims().pipe(
      map(claim => {
        const prodSandbox = claim.sandboxes.find(sandbox => sandbox.type === 'Production');
        return prodSandbox.id;
      })
    );
  }

  public getClaimsNative(): Observable<Claim> {
    return from(this.nativeHttp.get(LIVE_APPS_URL + '/organisation/v1/claims', {}, {})
        .then( data => {
          sessionStorage.setItem('tcsTimestamp', Date.now().toString());
          return JSON.parse(data.data);
        })
    );
  }

  // get claims
  public getClaims(): Observable<Claim> {
    const url = '/organisation/v1/claims';
    return this.http.get(url)
      .pipe(
        map(claim => new Claim().deserialize(claim)));
  }

  // get info for a single userId
  public getUserInfo(userId: string): Observable<UserInfo> {
    const url = '/organisation/v1/users/' + userId;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.get(url, {headers})
      .pipe(
        map(userinfo => new UserInfo().deserialize(userinfo))
      );
  }

  // get users for a group
  public getUsersForGroup(groupId: number, sandbox: number): Observable<UserInfoList> {
    const url = '/organisation/v1/groups/' + groupId + '/users?$sandbox=' + sandbox;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.get(url, {headers})
      .pipe(
        map(users => new UserInfoList().deserialize({users}))
      );
  }

  // get user by username (emailId)
  public getUserByUsername(username: string): Observable<UserInfo> {
    const url = '/organisation/v1/users?$filter=username eq \'' + username + '\'';
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.get(url, {headers}).pipe(
      map((userinfos) => {
        const userInfoList = new UserInfoList().deserialize({users: userinfos});
        if (userInfoList.users.length > 0) {
          return new UserInfo().deserialize(userinfos[0]);
        } else {
          throwError('No matching userId: ' + username);
        }
      })
    );
  }

  // get users by usernames (emailId)
  public getUsersByUsername(usernames: string[]): Observable<UserInfoList> {
    const userInfoCalls$ = [];
    usernames.forEach(username => {
      const userInfoCall$ = this.getUserByUsername(username).pipe(
        map(userinfo => new UserInfo().deserialize(userinfo))
      );
      userInfoCalls$.push(userInfoCall$);
    });

    return forkJoin(userInfoCalls$).pipe(
      map(userInfos => {
        return new UserInfoList().deserialize({users: userInfos});
      })
    );

  }

}
