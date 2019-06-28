import {Component, OnInit} from '@angular/core';
import {IonNav, NavController, NavParams} from '@ionic/angular';
import {Barcode} from '../../models/barcode';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {PhotoPage} from '../../photo/photo.page';
import {DomSanitizer} from '@angular/platform-browser';
import { IonItemSliding } from '@ionic/angular';
import {BarcodePage} from '../../barcode/barcode.page';

@Component({
  selector: 'app-photo',
  templateUrl: 'header.page.html',
  styleUrls: ['header.page.scss']
})
export class HeaderPage implements OnInit {
  private headerFg: FormGroup;
  private initdata: any;
  public truckNoPhoto: any;
  public preUnloadPhoto: any;
  private photoPageComponent = PhotoPage;
  private barcodePageComponent = BarcodePage;

  constructor(public navCtrl: IonNav, public navParams: NavParams, private formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
    this.initdata = this.navParams.get('data') ? this.navParams.get('data') : {};
    this.headerFg = this.formBuilder.group({
      buCodeRcv: [this.initdata.buCodeRcv],
      buTypeRcv: [this.initdata.buTypeRcv],
      buNameRcv: [this.initdata.buNameRcv],
      csmNo: [this.initdata.csmNo, Validators.required],
      sealNo: [this.initdata.sealNo],
      slTime: [this.initdata.slTime],
    });
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
      this.navParams.get('callback')(this.headerFg.value);
  }

  ngOnInit(): void {
  }
}
