import {Injectable} from '@angular/core';
import {forkJoin, Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs/internal/observable/from';
import {TcCaseProcessesService} from './tc-case-processes.service';
import {TcDocumentService} from './tc-document.service';
import {of} from 'rxjs/internal/observable/of';
import {flatMap, map} from 'rxjs/operators';
import {LoadingController} from '@ionic/angular';
import {ArticleInfo} from '../models/article';

export const sandboxId = 3534;
export const appId = '3296';
export const processId = '15098';

@Injectable({
    providedIn: 'root'
})
export class CreateflowService {

    constructor(private loadingController: LoadingController, private processService: TcCaseProcessesService, private docService: TcDocumentService) {
    }

    public createCase(header: any, articles: any, data: any, documents: any): Observable<string> {
        /* This service does the following:
        - displays notification that reporting is being created
        - calls processes service to create a new Live Apps Case
        - uploads any photos to the newly created live apps case
        - returns the case reference to the observable caller.
         */

        let statusMessage;
        return of(this.loadingController.create({
            message: 'Creating report...'
        })
            .then((res) => {
                res.present();
                res.onDidDismiss().then((dis) => {
                    alert('Case ' + dis.data.caseIdentifier + ' created');
                });
                statusMessage = res;
            })
        ).pipe(
            flatMap(response => {
                const proc$ = this.processService.runProcessNative(sandboxId, appId, processId, undefined, this.createDataPayload('Mobile', data));
                return proc$
                    .pipe(
                        flatMap(response2 => {
                            response2 = JSON.parse(response2);
                            const resp = this.parseProcessResponse(response2);
                            console.log('resp:', resp);
                            const docs$ = this.createDocUploadRequests(documents, resp.caseReference, sandboxId);
                            if (docs$.length > 0) {
                                statusMessage.message = 'Uploading images...';
                                return forkJoin(docs$)
                                    .pipe(
                                        map(responses => {
                                            this.loadingController.dismiss({caseId: resp.caseReference, caseIdentifier: resp.caseIdentifier});
                                            return resp.caseReference;
                                        })
                                    );
                            } else {
                                this.loadingController.dismiss({caseId: resp.caseReference, caseIdentifier: resp.caseIdentifier});
                                return of(resp.caseReference);
                            }
                        })
                    );
            })
        );
    }

    private parseProcessResponse(response: any): { caseIdentifier: string, caseReference: string } {
        let caseIdentifier;
        let caseReference;
        if (response) {
            if (!response.data.errorMsg) {
                if (response.caseIdentifier) {
                    caseIdentifier = response.caseIdentifier;
                }
                if (response.caseReference) {
                    caseReference = response.caseReference;
                }
            }
        }
        return {caseIdentifier, caseReference};
    }

    private createDocUploadRequests(documents: any[], caseRef, sandbox): Observable<any>[] {
        const docs$ = [];
        let docId = 0;
        documents.forEach((doc) => {
            docId++;
            const docName = caseRef + '-' + docId + '.jpeg';
            docs$.push(this.docService.uploadDocumentNative('caseFolders', caseRef, sandbox, doc.path, docName, 'Uploaded by creator'));
        });
        return docs$;
    }

    private createDataPayload(rootElementName: string, data: any) {
        return {
            [rootElementName]: data
        };
    }

}
