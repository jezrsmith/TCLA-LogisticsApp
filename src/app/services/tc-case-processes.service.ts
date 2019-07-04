import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {TcCommonFunctions} from './tc-common-functions';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs/internal/observable/from';
import { LIVE_APPS_URL } from './tc-login.service';

@Injectable({
  providedIn: 'root'
})
export class TcCaseProcessesService {

  constructor(private http: HttpClient, private nativeHttp: HTTP) { }

    public runProcessNative(sandboxId: number, appId: string, processId: string, caseReference: string, data: any): Observable<any> {
        const url = LIVE_APPS_URL + '/process/v1/processes';
        // convert data to an escaped JSON string
        let dataJson;
        if (data) {
            dataJson = TcCommonFunctions.escapeString(JSON.stringify(data));
        } else {
            dataJson = TcCommonFunctions.escapeString(JSON.stringify({}));
        }
        const body = {
            id: processId,
            sandboxId,
            applicationId: appId,
            data: dataJson,
            caseReference: undefined
        };

        if (caseReference) {
            body.caseReference = caseReference;
        }

        this.nativeHttp.setDataSerializer('json');
        console.log('Calling post to create process:', body);
        return from(this.nativeHttp.post(url, body, {'Content-Type': 'application/json'})
            .then(response => {
                console.log('response frm processes call:', response);
                sessionStorage.setItem('tcsTimestamp', Date.now().toString());
                return response.data;
            })
        );
    }

}
