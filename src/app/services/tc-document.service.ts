import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs/internal/observable/from';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file';
import { LIVE_APPS_URL } from './tc-login.service';
import {of} from 'rxjs/internal/observable/of';
export const sandboxId = 3534;

@Injectable({
    providedIn: 'root'
})
export class TcDocumentService {

    constructor(private http: HttpClient, private nativeHttp: HTTP, private transfer: FileTransfer) {
    }

    public uploadDocumentNative(folderType: string, folderId: string, sandbox: number,
                                fileToUpload: any, fileName: string, description: string): Observable<any> {
        let url = LIVE_APPS_URL + '/webresource/v1/' + folderType
            + '/' + folderId
            + '/artifacts/' + fileName + '/upload/';

        if (sandboxId) {
            url = url + '?$sandbox=' + sandboxId;
        }

        if (description) {
            url = url + '&description=' + description;
        }
        const headers = {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            enctype: 'multipart/form-data'
        };
        // const imageBlob = this.convertBase64ToBlob(base64Image);
        const options = {
            fileKey: 'artifactContents',
            mimeType: 'image/jpeg'
        }
        const fileTransfer: FileTransferObject = this.transfer.create();
        return from(fileTransfer.upload(fileToUpload, encodeURI(url), options, true)
            .then( response => {
                sessionStorage.setItem('tcsTimestamp', Date.now().toString());
                return response;
            })
        );
    }

}
