import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
const { Geolocation, Modals } = Plugins;
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import {Router} from '@angular/router';
import {IonSlides, Platform} from '@ionic/angular';

@Component({
  selector: 'welcome-tab',
  templateUrl: 'welcome-tab.page.html',
  styleUrls: ['welcome-tab.page.scss']
})
export class WelcomeTabPage {

    slideOpts = {
        pager: true
    };

  constructor(private router: Router, public platform: Platform) {}
    @ViewChild('welcomeSlides') welcomeSlides: IonSlides;

    fileReport = () => {
      this.router.navigate(['/tabs/report-tab'], {queryParams: {}});
    }

    @HostListener('window:resize')
    public onResize() {
        if (this.platform.is('ios') || this.platform.is('android')) {
            setTimeout(() => {
                if (this.welcomeSlides) {
                    this.welcomeSlides.update();
                }
            }, 100);
        }
    }
}
