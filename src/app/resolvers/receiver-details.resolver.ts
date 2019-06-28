/* Used to resolve the receiver info for an email address */

import { Injectable } from '@angular/core';
import {Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {ReceiverInfo} from '../models/receiver';
import {TcOrganizationService} from '../services/tc-organization.service';
import {of} from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {flatMap} from 'rxjs/internal/operators';
import {LogisticsService} from '../services/logistics.service';

export const EMAIL_ID_KEY = 'tcs-login-email-id';
export const CLIENT_ID_KEY = 'tcs-login-client-id';

@Injectable()
export class ReceiverDetailsResolver implements Resolve<ReceiverInfo> {

  constructor(private orgService: TcOrganizationService, private logisticsService: LogisticsService, private router: Router) {}

  resolve(): Observable<ReceiverInfo> {
    return this.orgService.getClaimsNative().pipe(
        flatMap(claims => {
            /*return of(new ReceiverInfo().deserialize({
                buCodeRcv: '059',
                buTypeRcv: 'STO',
                buNameRcv: 'IKEA Bucharest - Baneasa'
            }));*/
          return this.logisticsService.getReceiverInfoNative(claims.email).pipe(
              map(receiver => {
                receiver.emailId = claims.email;
                receiver.firstName = claims.firstName;
                receiver.lastName = claims.lastName;
                receiver.userId = claims.id;
                receiver.username = claims.username;
                const prodSandbox = claims.sandboxes.find(sandbox => sandbox.type === 'Production');
                receiver.sandboxId = prodSandbox.id;
                return receiver;
              })
          );
        }),
        catchError(error => {
            console.error(error);
            this.router.navigate(['/login'], {});
            return of(new ReceiverInfo());
        })
    );
  }

}
