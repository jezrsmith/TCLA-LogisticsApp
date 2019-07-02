import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, Observable, throwError} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs/internal/observable/from';
import {ReceiverInfo} from '../models/receiver';
import {ArticleInfo, DamageType, NonComplianceCategory, NonComplianceCode, SupplierInfo} from '../models/article';
import {map} from 'rxjs/operators';

export const LOGISTICS_RECEIVER_URL = 'https://eu-west-1.integration.cloud.tibcoapps.com:443/h77275l2pygahkqe4hki7udtnk4wd6bq/Csy_data/csy_data/rest/v1/';
export const ARTICLE_INFO_URL = 'https://eu-west-1.integration.cloud.tibcoapps.com:443/h77275l2pygahkqe4hki7udtnk4wd6bq/Csy_data/csy_data/rest/v1/items';
export const ARTICLE_SUPPLIER_URL = 'https://eu-west-1.integration.cloud.tibcoapps.com:443/h77275l2pygahkqe4hki7udtnk4wd6bq/Csy_data/csy_data/rest/v1/item_suppliers';
export const DAMAGE_TYPE_URL = 'https://eu-west-1.integration.cloud.tibcoapps.com:443/h77275l2pygahkqe4hki7udtnk4wd6bq/Csy_data/csy_data/rest/v1/damage_type';
export const NON_COMP_CAT_URL = 'https://eu-west-1.integration.cloud.tibcoapps.com:443/h77275l2pygahkqe4hki7udtnk4wd6bq/Csy_data/csy_data/rest/v1/non_compliance_cat';
export const NON_COMP_CODE_URL = 'https://eu-west-1.integration.cloud.tibcoapps.com:443/h77275l2pygahkqe4hki7udtnk4wd6bq/Csy_data/csy_data/rest/v1/non_compliance_code';

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

    // not used
    public getInfoForArticleNumber(itemNumber: number): Observable<ArticleInfo> {
        // this combines the article details with possible suppliers into the single Article Info object
        const articleDetails$ = this.getArticleDetailsByNumberNative(itemNumber);
        const articleSuppliers$ = this.getSuppliersForArticleNative(itemNumber);

        // call both in parallel and combine result
        const callArray$ = forkJoin([ articleDetails$, articleSuppliers$ ])
            .pipe(
                map(([ articleDetails, articleSuppliers ]) => {
                const response = articleDetails[0];
                if (response !== undefined) {
                    response.suppliers = articleSuppliers;
                }
                return response;
            })
            );
        return callArray$;
    }

    public getArticleDetailsByNumberNative(itemNumber: number): Observable<ArticleInfo[]> {
        const url = ARTICLE_INFO_URL + '?item=' + itemNumber;
        return from(this.nativeHttp.get(url, {}, {})
            .then(data => {
                console.log(data);
                const rawResponse = JSON.parse(data.data);
                const articles: ArticleInfo[] = [];
                rawResponse.ItemsResponse.ItemsResult.row.forEach(article => {
                    const articleInfo = new ArticleInfo().deserialize( {
                        itemNo: article.ITEM_NO,
                        itemName: article.ITEM_NAME
                    });
                    articles.push(articleInfo);
                });
                return articles;
            }));
    }

    public getSuppliersForArticleNative(itemNumber: number): Observable<SupplierInfo[]> {
        const url = ARTICLE_SUPPLIER_URL + '?item=' + itemNumber;
        return from(this.nativeHttp.get(url, {}, {})
            .then(data => {
                const rawResponse = JSON.parse(data.data);
                const suppliers: SupplierInfo[] = [];
                rawResponse.ItemSuppliersResponse.ItemSuppliersResult.row.forEach(supplier => {
                    const supplierInfo = new SupplierInfo().deserialize(
                        {
                            buCodeSup: supplier.BU_CODE_SUP,
                            buNameSup: supplier.BU_NAME_SUP,
                            buTypeSup: supplier.BU_TYPE_SUP
                        }
                    );
                    suppliers.push(supplierInfo);
                });
                return suppliers;
            }));
    }

    public getNonComplianceCatNative(cat: number): Observable<NonComplianceCategory[]> {
        const url = NON_COMP_CAT_URL + '?category=' + cat;
        return from(this.nativeHttp.get(url, {}, {})
            .then(data => {
                const rawResponse = JSON.parse(data.data);
                const categoryInfos: NonComplianceCategory[] = [];
                rawResponse.NonCompliance_CatResponse.NonCompliance_CatResult.row.forEach(category => {
                    const categoryInfo = new NonComplianceCategory().deserialize(
                        {
                            nonCompCategoryCode: category.NONCOMP_CATEGORY,
                            nonCompCategoryDescription: category.NONCOMP_CATEGORY_DESCRIPTION
                        }
                    );
                    categoryInfos.push(categoryInfo);
                });
                return categoryInfos;
            }));
    }

    public getNonComplianceCodeNative(cat: number): Observable<NonComplianceCode[]> {
        const url = NON_COMP_CODE_URL + '?category=' + cat;
        return from(this.nativeHttp.get(url, {}, {})
            .then(data => {
                const rawResponse = JSON.parse(data.data);
                const codeInfos: NonComplianceCode[] = [];
                rawResponse.NonCompliance_CodeResponse.NonCompliance_CodeResult.row.forEach(category => {
                    const codeInfo = new NonComplianceCode().deserialize(
                        {
                            nonCompCodeId: category.NONCOMP_CODE_ID,
                            nonCompCode: category.NONCOMP_CODE,
                            nonCompCodeName: category.NONCOMP_CODE_NAME,
                            nonCompCodeDescription: category.NONCOMP_CODE_DESCRIPTION
                        }
                    );
                    codeInfos.push(codeInfo);
                });
                return codeInfos;
            }));
    }

    public getDamageTypeNative(code: number): Observable<DamageType[]> {
        const url = DAMAGE_TYPE_URL + '?code=' + code;
        return from(this.nativeHttp.get(url, {}, {})
            .then(data => {
                const rawResponse = JSON.parse(data.data);
                const damageTypes: DamageType[] = [];
                rawResponse.DamageTypeResponse.DamageTypeResult.row.forEach(dmgType => {
                    const damageType = new DamageType().deserialize(
                        {
                            damageTypeCode: dmgType.DamageType_Code,
                            damageTypeDescription: dmgType.DamageType_Description
                        }
                    );
                    damageTypes.push(damageType);
                });
                return damageTypes;
            })
        );
    }
}
