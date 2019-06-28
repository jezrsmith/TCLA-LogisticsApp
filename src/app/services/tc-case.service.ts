import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {flatMap, map, tap} from 'rxjs/operators';
import {TcCommonFunctions} from './tc-common-functions';
import {CaseInfo, CaseType} from '../models/tc-case';

@Injectable({
  providedIn: 'root'
})
export class TcCaseService {

  constructor(private http: HttpClient) { }

  public getCaseTypeInfoByAppName(sandboxId: number, appName: string): Observable<CaseType> {
    const url = '/case/v1/types?$sandbox=' + sandboxId + '&$filter=applicationName eq ' + '\'' + appName + '\' and isCase eq TRUE';
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.get(url, { headers } ).pipe(
      map(caseType => new CaseType().deserialize(caseType[0]))
    );
  }

  public getCaseTypeInfoByAppId(sandboxId: number, appId: string): Observable<CaseType> {
    const url = '/case/v1/types?$sandbox=' + sandboxId + '&$filter=applicationId eq ' + Number(appId) + ' and isCase eq TRUE';
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.get(url, { headers } ).pipe(
      map(caseType => new CaseType().deserialize(caseType[0]))
    );
  }

  public getCaseState(caseRef: string, sandboxId: number): Observable<string> {
    const url = '/case/v1/cases/' + caseRef + '/' + '?$sandbox=' + sandboxId + '&$select=s';
    return this.http.get(url)
      .pipe(
        map(caseinfo => {
          const caseinf = new CaseInfo().deserialize(caseinfo);
          const state: string = caseinf.summaryObj.state;
          return state;
        })
      );
  }

}
