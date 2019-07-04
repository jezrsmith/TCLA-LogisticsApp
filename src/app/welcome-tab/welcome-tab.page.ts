import {Component, OnInit} from '@angular/core';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {bindCallback} from 'rxjs/internal/observable/bindCallback';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
const { Geolocation, Modals } = Plugins;
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'welcome-tab',
  templateUrl: 'welcome-tab.page.html',
  styleUrls: ['welcome-tab.page.scss']
})
export class WelcomeTabPage implements OnInit {

  coords: Coordinates = null;
  photo: SafeResourceUrl;
  scannedData: {};
  error: string;
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private sanitizer: DomSanitizer, private barcodeScanner: BarcodeScanner, private qrScanner: QRScanner) {}

    scanCode() {
      this.barcodeScanner
          .scan()
          .then(barcodeData => {
            console.log(barcodeData);
            alert('Barcode data ' + JSON.stringify(barcodeData));
            this.scannedData = barcodeData;
          })
          .catch(err => {
            console.log('Error', err);
            this.error = err;
          });
    }

    scanQr() {
      this.qrScanner.prepare()
          .then((status: QRScannerStatus) => {
            if (status.authorized) {
              // camera permission was granted


              // start scanning
              const scanSub = this.qrScanner.scan().subscribe((text: string) => {
                console.log('Scanned something', text);
                alert('Scanned: '  + text);

                this.qrScanner.hide(); // hide camera preview
                scanSub.unsubscribe(); // stop scanning
              });

            } else if (status.denied) {
              // camera permission was permanently denied
              // you must use QRScanner.openSettings() method to guide the user to the settings page
              // then they can grant the permission from there
            } else {
              // permission was denied, but not permanently. You can ask for permission again at a later time.
            }
          })
          .catch((e: any) => console.log('Error is', e));
    }

    async takePicture() {
      const image = await Plugins.Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    }

    watchPosition(): Observable<any> {
      const watch = bindCallback(Geolocation.watchPosition)({});
      return watch.pipe(map((pos: any) => {
       return pos.coords;
      }));
    }

    ngOnInit() {
      /*this.watchPosition().subscribe( coords =>
          this.coords = coords
      );*/
    }
}
