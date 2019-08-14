import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {IonNav, NavParams} from '@ionic/angular';
import {Barcode} from '../models/barcode';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-qrcode',
  templateUrl: 'qrcode.page.html',
  styleUrls: ['qrcode.page.scss']
})
export class QrcodePage implements OnInit {
  scannedData: Barcode;

  constructor(private sanitizer: DomSanitizer, public navCtrl: IonNav, public navParams: NavParams, private qrScanner: BarcodeScanner) {}

    scanCode() {
        this.qrScanner
            .scan({
                preferFrontCamera : false,
                showFlipCameraButton : true,
                showTorchButton : true,
                formats : 'QR_CODE'
            })
            .then(qrData => {
                this.scannedData = new Barcode().deserialize(qrData);
                this.navCtrl.pop().then(() => {
                    this.navParams.get('callback')(this.scannedData);
                });
            })
            .catch(err => {
                console.log('Error', err);
            });
    }

    ngOnInit(): void {
        this.scanCode();
    }
}
