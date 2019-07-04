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
import {Article, Report} from '../models/report';

export const sandboxId = 31;
export const appId = '2952';
export const processId = '12867';

@Injectable({
    providedIn: 'root'
})
export class CreateflowService {

    constructor(private loadingController: LoadingController, private processService: TcCaseProcessesService, private docService: TcDocumentService) {
    }

    public constructReport(header: any, articles: any[]): Report {
        console.log('construct report for header: ', header);
        console.log('construct report for articles: ', articles);
        // set header
        const report = new Report().deserialize(
            {
                BuCodeRcv: header.buCodeRcv,
                BuTypeRcv: header.buTypeRcv,
                BuNameRcv: header.buNameRcv,
                UnloadDate: header.unloadDate,
                CsmNo: header.csmNo,
                SealNo: header.sealNo,
                SlTime: header.slTime,
                Articles: []
            }
        );
        console.log('header created: ', report);
        articles.forEach(article => {
            const articleObj = new Article().deserialize(
                {
                    ItemNo: article.itemNo,
                    ItemName: article.itemName,
                    BuCodeSup: article.buCodeSup,
                    ItemQtyDsp: article.itemQtyDsp,
                    ItemQtyRcvGood: article.itemQtyRcvGood,
                    ItemQtyRcvDamaged: article.itemQtyRcvDamaged,
                    ItemQtyDiff: article.itemQtyDiff,
                    DamageType: article.damageType,
                    NonComplianceCategory: article.nonComplianceCategory,
                    NonComplianceCode: article.nonComplianceCode,
                    NonComplianceCodeDescription: article.nonComplianceCodeDescription,
                    SlMinutes: article.slMinutes
                }
            )
            report.Articles.push(articleObj);
        });
        return report;
    }

    public createCase(header: any, articles: any): Observable<string> {
        /* This service does the following
        - displays notification that reporting is being created
        - constructs report containing header and articles
        - calls processes service to create a new Live Apps Case passing report as data
        - constructs list of attachments and uploads them to the newly created live apps case
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
                console.log('constructing report');
                const report = this.constructReport(header, articles);
                console.log('report: ', report);
                const proc$ = this.processService.runProcessNative(sandboxId, appId, processId, undefined, this.createDataPayload('Report', report));
                return proc$
                    .pipe(
                        flatMap(response2 => {
                            response2 = JSON.parse(response2);
                            const resp = this.parseProcessResponse(response2);
                            console.log('resp:', resp);
                            const docs$ = this.createDocUploadRequests(header, articles, resp.caseReference, sandboxId);
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

    private createDocUploadRequests(header: any, articles: any[], caseRef, sandbox): Observable<any>[] {
        const docs$ = [];

        // add header docs
        if (header._truckNoPhoto) {
            const docName = 'LU-number.jpeg';
            console.log('file: ', header._truckNoPhoto);
            docs$.push(this.docService.uploadDocumentNative('caseFolders', caseRef, sandbox, header._truckNoPhoto.path, docName, 'Photo of Loading Unit Number'));
        }
        if (header._preUnloadPhoto) {
            const docName = 'Pre-unload.jpeg';
            docs$.push(this.docService.uploadDocumentNative('caseFolders', caseRef, sandbox, header._preUnloadPhoto.path, docName, 'Photo of Loading Unit pre unload'));
        }

        // add header attachments
        if (header._files) {
            header._files.forEach((doc) => {
                const docName = doc.description;
                docs$.push(this.docService.uploadDocumentNative('caseFolders', caseRef, sandbox, doc.path, docName, 'Header Attachment'));
            });
        }

        // add article attachments
        articles.forEach(article => {
            if (article._files) {
                article._files.forEach((doc) => {
                    const docName = doc.description;
                    docs$.push(this.docService.uploadDocumentNative('caseFolders', caseRef, sandbox, doc.path, docName, (article.itemNo + '-attachment')));
                });
            }
        });

        return docs$;
    }

    private createDataPayload(rootElementName: string, data: any) {
        return {
            [rootElementName]: data
        };
    }

}
