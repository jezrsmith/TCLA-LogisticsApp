import {Component, OnInit} from '@angular/core';
import {IonNav, NavController, NavParams} from '@ionic/angular';
import {Barcode} from '../../models/barcode';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {PhotoPage} from '../../photo/photo.page';
import {DomSanitizer} from '@angular/platform-browser';
import { IonItemSliding } from '@ionic/angular';
import {BarcodePage} from '../../barcode/barcode.page';
import {Attachment} from '../../models/attachment';
import {min} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: 'header.page.html',
  styleUrls: ['header.page.scss']
})
export class HeaderPage implements OnInit {
  private headerFg: FormGroup;
  private initdata: any;
  private passedData: any;
  public truckNoPhoto: any;
  public preUnloadPhoto: any;
  private photoPageComponent = PhotoPage;
  private barcodePageComponent = BarcodePage;
  attachments: Attachment[];
  outAttachments: Attachment[];
  attachReady = false;
  now = new Date().toISOString();
  minDate;

  constructor(public navCtrl: IonNav, public navParams: NavParams, private formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
    this.passedData = this.navParams.get('data') ? this.navParams.get('data') : {};
    this.initdata = this.passedData.formData;
    if (!this.initdata.unloadDate) {
      this.initdata.unloadDate = this.now;
    }
    const today = new Date();
    const newdate = new Date();
    newdate.setDate(today.getDate() - 30);
    this.minDate = newdate.toISOString();

    this.headerFg = this.formBuilder.group({
      buCodeRcv: [this.initdata.buCodeRcv],
      buTypeRcv: [this.initdata.buTypeRcv],
      buNameRcv: [this.initdata.buNameRcv],
      unloadDate: [this.initdata.unloadDate],
      csmNo: [this.initdata.csmNo, Validators.required],
      sealNo: [this.initdata.sealNo],
      slTime: [this.initdata.slTime]
    });
    if (this.passedData.preUnloadPhoto) {
      this.preUnloadPhoto = this.passedData.preUnloadPhoto.file;
    }
    if (this.passedData.truckNoPhoto) {
      this.truckNoPhoto = this.passedData.truckNoPhoto.file;
    }
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
      this.headerFg.get(attribName).setValue(scannedData.text);
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
      const files: Attachment[] = [ ...this.outAttachments ];
      let truckNoPhotoAttach: Attachment;
      if (this.truckNoPhoto) {
        truckNoPhotoAttach = new Attachment().deserialize(
            {
              type: 'photo',
              file: this.truckNoPhoto,
              description: 'LU_Number'
            }
        );
      }
      let preUnloadPhotoAttach: Attachment;
      if (this.preUnloadPhoto) {
        preUnloadPhotoAttach = new Attachment().deserialize(
            {
              type: 'photo',
              file: this.truckNoPhoto,
              description: 'LU_Number'
            }
        );
      }
      this.navParams.get('callback')({ formData: this.headerFg.value, files, truckNoPhoto: truckNoPhotoAttach, preUnloadPhoto: preUnloadPhotoAttach });
  }

  ngOnInit(): void {
  }
}
