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
import {ArticleInfo} from '../../models/article';

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
  public articleItems: ArticleInfo[] = [];
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
      buCodeSup: [this.initdata.buCodeSup]
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
                  this.articleFG.get('itemName').setValue(next[0].itemName);
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

  public selectArticle(article) {
    console.log('Selected: ', article);
    this.articleFG.get('itemNo').setValue(article.itemNo);
    this.articleFG.get('itemName').setValue(article.itemName);
    this.articleItems.length = 0;
    this.articleSearchbar.value = undefined;
  }

  ngOnInit(): void {
  }
}
