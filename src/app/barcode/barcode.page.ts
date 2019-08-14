import {Component, OnInit} from '@angular/core';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {bindCallback} from 'rxjs/internal/observable/bindCallback';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
const { Geolocation, Modals } = Plugins;
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import {IonNav, NavController, NavParams} from '@ionic/angular';
import {Barcode} from '../models/barcode';

@Component({
  selector: 'app-barcode',
  templateUrl: 'barcode.page.html',
  styleUrls: ['barcode.page.scss']
})
export class BarcodePage implements OnInit {
  private data: any = {};

  constructor(private sanitizer: DomSanitizer, public navCtrl: IonNav, public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
      this.data.attribName = this.navParams.get('data') ? this.navParams.get('data') : {};
      this.scanCode(this.data.attribName);
  }

  scanCode(attribName: string) {
    this.barcodeScanner
        .scan({
            preferFrontCamera : false,
            showFlipCameraButton : true,
            showTorchButton : true,
            formats : 'EAN_13,EAN_8,UPC_E,UPC_A,DATA_MATRIX,CODE_39,CODE_93,CODE_128,ITF,PDF_417,AZTEC, QR_CODE'
        })
        .then(barcodeData => {
          const scannedData = new Barcode().deserialize(barcodeData);
          this.navCtrl.pop().then(() => {
            this.navParams.get('callback')(attribName, scannedData);
          });
        })
        .catch(err => {
          console.log('Error', err);
        });
  }

  ngOnInit(): void {
  }
}
