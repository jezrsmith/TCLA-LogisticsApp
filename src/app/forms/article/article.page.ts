import {Component, OnInit, ViewChild} from '@angular/core';
import {IonNav, IonSearchbar, NavController, NavParams} from '@ionic/angular';
import {Barcode} from '../../models/barcode';
import {Validators, FormBuilder, FormGroup, ValidatorFn, ValidationErrors} from '@angular/forms';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {PhotoPage} from '../../photo/photo.page';
import {DomSanitizer} from '@angular/platform-browser';
import { IonItemSliding } from '@ionic/angular';
import {BarcodePage} from '../../barcode/barcode.page';
import {Attachment} from '../../models/attachment';
import {min} from 'rxjs/operators';
import {LogisticsService} from '../../services/logistics.service';
import {ArticleInfo, DamageType, NonComplianceCategory, NonComplianceCode} from '../../models/article';

import { AbstractControl } from '@angular/forms';

export const nonComplianceCategoryValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null =>  {
    console.log('validate start');
    // nonCompliance category is mandatory if Qty Rcv Damage is 0 and Qty Diff is 0. Else optional.
    const itemQtyRcvDamaged = control.get('itemQtyRcvDamaged');
    const itemQtyDiff = control.get('itemQtyDiff');
    const nonComplianceCategory = control.get('nonComplianceCategory');
    const nonComplianceCode = control.get('nonComplianceCode');
    console.log('validate start:', itemQtyRcvDamaged, itemQtyDiff, nonComplianceCategory);
    return (itemQtyRcvDamaged && itemQtyDiff && (itemQtyRcvDamaged.value === 0 && itemQtyDiff.value === 0) && (!nonComplianceCategory.value || !nonComplianceCode.value)) ? { nonCompCatRequired: true } : null;
}

@Component({
  selector: 'app-header',
  templateUrl: 'article.page.html',
  styleUrls: ['article.page.scss']
})
export class ArticlePage implements OnInit {
  @ViewChild('articleSearchbar') articleSearchbar: IonSearchbar;
  private articleFg: FormGroup;
  private initdata: any;
  private passedData: any;
  private photoPageComponent = PhotoPage;
  private barcodePageComponent = BarcodePage;
  private valid = false;
  private index: number;
  private searchTerm: string;
  public selectedArticle: ArticleInfo;
  public articleItems: ArticleInfo[] = [];
  public damageTypes: DamageType[];
  public nonComplianceCategories: NonComplianceCategory[];
  public nonComplianceCodes: NonComplianceCode[];
  public selectedCodeDescription: string;
  public showCodeDescription = false;
  attachments: Attachment[];
  outAttachments: Attachment[];
  attachReady = false;

  constructor(public navCtrl: IonNav, public navParams: NavParams, private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private logisticsService: LogisticsService) {
    this.passedData = this.navParams.get('data') ? this.navParams.get('data') : {};
    this.initdata = this.passedData.formData;
    this.index = this.passedData.index;
    this.articleFg = this.formBuilder.group({
      itemNo: [this.initdata.itemNo, Validators.required],
      itemName: [this.initdata.itemName, Validators.required],
      buCodeSup: [this.initdata.buCodeSup, Validators.required],
      itemQtyDsp: [this.initdata.itemQtyDsp, Validators.required],
      itemQtyRcvGood: [this.initdata.itemQtyRcvGood, Validators.required],
      itemQtyRcvDamaged: [this.initdata.itemQtyRcvDamaged, Validators.required],
      itemQtyDiff: [this.initdata.itemQtyDiff],
      damageType: [this.initdata.damageType],
      nonComplianceCategory: [this.initdata.nonComplianceCategory],
      nonComplianceCode: [this.initdata.nonComplianceCode],
      nonComplianceCodeDescription: [this.initdata.nonComplianceCodeDescription],
      slMinutes: [this.initdata.slMinutes]
    }, { validators: nonComplianceCategoryValidator });
    if (this.passedData.files && this.passedData.files.length > 0) {
      this.attachments = this.passedData.files;
    } else {
      this.attachments = [];
    }
    this.attachReady = true;
  }

  handleAttachmentsChange = (attachments) => {
    this.outAttachments = attachments;
  }

  photoCallback = data => {
    if (data.photo) {
      this[data.attribName] = this.sanitizer.bypassSecurityTrustUrl(data.photo.webPath);
    }
  }

  openPhoto(attribName, slidingItem?: IonItemSliding) {
    this.navCtrl.push(this.photoPageComponent, {
      data: attribName,
      callback: this.photoCallback
    });
    if (slidingItem) {
      slidingItem.close();
    }
  }

  scannerCallback = (attribName: string, scannedData: Barcode) => {
    if (scannedData.cancelled !== 1) {
      this.articleFg.get(attribName).setValue(Number(scannedData.text));
      if (attribName === 'itemNo') {
        this.logisticsService.getArticleDetailsByNumberNative(Number(scannedData.text))
            .subscribe(
                next => {
                  if (next[0]) {
                    this.selectArticle(next[0]);
                  } else {
                    alert('Item not found: ' + scannedData.text);
                  }
                }
            );
      }
    }
  }

  openScanner(attribName) {
    this.navCtrl.push(this.barcodePageComponent, {
      data: attribName,
      callback: this.scannerCallback
    });
  }

  clearImage(attribName, slidingItem: IonItemSliding) {
    this[attribName] = undefined;
    slidingItem.close();
  }

  public passData() {
      const files: Attachment[] = this.outAttachments ? [ ...this.outAttachments ] : [];
      this.valid = true;
      this.navParams.get('callback')({ formData: this.articleFg.value, files, index: this.index, valid: this.articleFg.valid });
  }

  public searchItems(event) {
    if (event.target.value && event.target.value.trim() !== '') {
      console.log(event.target.value);
      this.articleItems.length = 0;
      this.logisticsService.getArticleDetailsByNumberNative(event.target.value)
          .subscribe(
              next => {
                this.articleItems = next;
              }
          );
    } else {
      this.articleItems.length = 0;
    }
  }

  public selectArticle(article: ArticleInfo) {
    // get supplier info
    this.logisticsService.getSuppliersForArticleNative(article.itemNo)
        .subscribe(
            next => {
              console.log('Suppliers: ', next);
              this.selectedArticle = article;
              this.selectedArticle.suppliers = next;
              this.articleFg.get('itemNo').setValue(article.itemNo);
              this.articleFg.get('itemName').setValue(article.itemName);
              this.articleItems.length = 0;
              this.articleSearchbar.value = undefined;
            }
        );
  }

  public calcQtyDiff() {
    console.log('checking qty diff');
    const itemQtyRcvGood = this.articleFg.get('itemQtyRcvGood');
    const itemQtyRcvDamaged = this.articleFg.get('itemQtyRcvDamaged');
    const itemQtyDsp =  this.articleFg.get('itemQtyDsp');
    if (itemQtyRcvGood && itemQtyRcvGood.value !== undefined && itemQtyRcvDamaged && itemQtyRcvDamaged.value !== undefined && itemQtyDsp && itemQtyDsp.value !== undefined) {
        const insp = itemQtyRcvGood.value + itemQtyRcvDamaged.value;
        this.articleFg.get('itemQtyDiff').setValue(insp - itemQtyDsp.value);
        console.log('checking - set to: ', insp - itemQtyDsp.value);
    } else {
        console.log('checking - not setting');
        console.log('checking: ', itemQtyRcvGood.value, itemQtyRcvDamaged.value, itemQtyDsp.value);
    }

  }

  public selectNonComplianceCategory(event) {
    // get non comp code
      this.logisticsService.getNonComplianceCodeNative(event.target.value)
        .subscribe(
            next => {
              this.nonComplianceCodes = next;
              this.articleFg.get('nonComplianceCodeDescription').setValue(undefined);
              this.articleFg.get('nonComplianceCode').setValue(undefined);
            }
        );
  }

  public selectNonComplianceCode(event) {
      console.log('selected: ', event.target.value);
      console.log('coice: ', this.nonComplianceCodes);
      const complCode = this.nonComplianceCodes.find(code => code.nonCompCode === event.target.value );
      console.log('setting code desc to: ', complCode.nonCompCodeDescription);
      this.articleFg.get('nonComplianceCodeDescription').setValue(complCode.nonCompCodeDescription);
  }

  ngOnInit(): void {
    // get damage types
    this.logisticsService.getDamageTypeNative(-1)
        .subscribe(
            next => {
              this.damageTypes = next;
            }
        );

    // get non compliance categories
    this.logisticsService.getNonComplianceCatNative(-1)
        .subscribe(
            next => {
              this.nonComplianceCategories = next;
            }
        );
  }
}
