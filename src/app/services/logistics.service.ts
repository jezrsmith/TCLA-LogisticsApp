import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs/internal/observable/from';
import {ReceiverInfo} from '../models/receiver';

export const LOGISTICS_RECEIVER_URL = 'https://eu-west-1.integration.cloud.tibcoapps.com:443/h77275l2pygahkqe4hki7udtnk4wd6bq/Csy_data/csy_data/rest/v1/';

@Injectable({
    providedIn: 'root'
})
export class LogisticsService {

    constructor(private nativeHttp: HTTP) {
    }

    public getReceiverInfoNative(emailId: string): Observable<ReceiverInfo> {
        const url = LOGISTICS_RECEIVER_URL + 'receivers?userid=' + emailId;
        return from(this.nativeHttp.get(url, {}, {})
            .then(data => {
                // console.log(data);
                const rawResponse = JSON.parse(data.data);
                const response = rawResponse.ReceiversResponse.ReceiversResult;
                const receiverInfo = new ReceiverInfo().deserialize(
                    {
                        buCodeRcv: response.row[0].BU_CODE_RCV,
                        buTypeRcv: response.row[0].BU_TYPE_RCV,
                        buNameRcv: response.row[0].BU_NAME_RCV
                    }
                );
                return receiverInfo;
            })
        );
    }

}
