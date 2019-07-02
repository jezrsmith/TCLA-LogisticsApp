import {Component, OnInit, ViewChild} from '@angular/core';
import {IonNav, IonSearchbar, NavController, NavParams} from '@ionic/angular';
import {Barcode} from '../../models/barcode';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {PhotoPage} from '../../photo/photo.page';
import {DomSanitizer} from '@angular/platform-browser';
import { IonItemSliding } from '@ionic/angular';
import {BarcodePage} from '../../barcode/barcode.page';
import {Attachment} from '../../models/attachment';
import {min} from 'rxjs/operators';
import {LogisticsService} from '../../services/logistics.service';
import {ArticleInfo, DamageType, NonComplianceCategory, NonComplianceCode} from '../../models/article';

@Component({
  selector: 'app-header',
  templateUrl: 'article.page.html',
  styleUrls: ['article.page.scss']
})
export class ArticlePage implements OnInit {
  @ViewChild('articleSearchbar') articleSearchbar: IonSearchbar;
  private articleFG: FormGroup;
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
    this.articleFG = this.formBuilder.group({
      itemNo: [this.initdata.itemNo],
      itemName: [this.initdata.itemName],
      buCodeSup: [this.initdata.buCodeSup],
      itemQtyDsp: [this.initdata.itemQtyDsp],
      itemQtyRcvGood: [this.initdata.itemQtyRcvGood],
      itemQtyRcvDamaged: [this.initdata.itemQtyRcvDamaged],
      damageType: [this.initdata.damageType],
      nonComplianceCategory: [this.initdata.nonComplianceCategory],
      nonComplianceCode: [this.initdata.nonComplianceCode],
      nonComplianceCodeDescription: [this.initdata.nonComplianceCodeDescription]
    });
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
      this.articleFG.get(attribName).setValue(scannedData.text);
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
      this.navParams.get('callback')({ formData: this.articleFG.value, files, valid: this.valid, index: this.index });
      console.log('sending:', this.index, this.articleFG.value);
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
              this.articleFG.get('itemNo').setValue(article.itemNo);
              this.articleFG.get('itemName').setValue(article.itemName);
              this.articleItems.length = 0;
              this.articleSearchbar.value = undefined;
            }
        );
  }

  public calcQtyDiff() {
    const insp = this.articleFG.get('itemQtyRcvGood').value + this.articleFG.get('itemQtyRcvDamaged').value;
    const despatched = this.articleFG.get('itemQtyDsp').value;
    if (despatched && despatched > 0) {
      return (insp - despatched);
    } else {
      return 0;
    }
  }

  public selectNonComplianceCategory(event) {
    // get non comp code
      this.logisticsService.getNonComplianceCodeNative(event.target.value)
        .subscribe(
            next => {
              this.nonComplianceCodes = next;
              this.articleFG.get('nonComplianceCodeDescription').setValue(undefined);
            }
        );
  }

  public selectNonComplianceCode(event) {
      console.log('selected: ', event.target.value);
      console.log('coice: ', this.nonComplianceCodes);
      const complCode = this.nonComplianceCodes.find(code => code.nonCompCode === event.target.value );
      console.log('setting code desc to: ', complCode.nonCompCodeDescription);
      this.articleFG.get('nonComplianceCodeDescription').setValue(complCode.nonCompCodeDescription);
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
