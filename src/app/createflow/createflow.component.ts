import {Component, OnInit, ɵAPP_ID_RANDOM_PROVIDER} from '@angular/core';
import {PhotoPage} from '../photo/photo.page';
import {IonNav, LoadingController, NavParams} from '@ionic/angular';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {BarcodePage} from '../barcode/barcode.page';
import {Barcode} from '../models/barcode';
import {QrcodePage} from '../qrcode/qrcode.page';
import {DatafieldsPage} from '../forms/datafields/datafields.page';
import {CreateflowService} from '../services/tc-createflow.service';
import {error} from 'selenium-webdriver';
import {TcDocumentService} from '../services/tc-document.service';
import {IonicWindow} from '@ionic/angular/dist/types/interfaces';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {ReceiverInfo} from '../models/receiver';
import {HeaderPage} from '../forms/header/header.page';
import {Attachment} from '../models/attachment';
import {ArticlePage} from '../forms/article/article.page';
import {ValidationStatus} from '../models/validation';

@Component({
    selector: 'app-createflow',
    templateUrl: './createflow.component.html',
    styleUrls: ['./createflow.component.scss']
})
export class CreateflowComponent implements OnInit {

    receiverInfo: ReceiverInfo;
    photoPageComponent = PhotoPage;
    barcodePageComponent = BarcodePage;
    qrcodePageComponent = QrcodePage;
    datafieldsPageComponent = DatafieldsPage;
    headerPageComponent = HeaderPage;
    articlePageComponent = ArticlePage;
    header: any = {};
    articles: any[] = [];
    photo: any[] = [];
    barcode: Barcode[] = [];
    qrcode: Barcode[] = [];
    datafields: any;
    validationStatus: ValidationStatus = new ValidationStatus().deserialize(
        {
            headerValid: false,
            articleValid: []
        }
    );
    grid: Array<Array<SafeResourceUrl>>;

    constructor(private sanitizer: DomSanitizer, private webview: WebView, private navCtrl: IonNav, public navParams: NavParams, private createflowService: CreateflowService, private docService: TcDocumentService) {
        this.receiverInfo = new ReceiverInfo().deserialize(this.navParams.data);
        this.header.buTypeRcv = this.receiverInfo.buTypeRcv;
        this.header.buCodeRcv = this.receiverInfo.buCodeRcv;
        this.header.buNameRcv = this.receiverInfo.buNameRcv;
    }

    photoCallback = data => {
        if (data !== undefined) {
            this.photo.push(data);
            this.grid = Array(Math.ceil(this.photo.length / 5));
            let rowNum = 0; // counter to iterate over the rows in the grid
            for (let i = 0; i < this.photo.length; i += 5) { // iterate images

                this.grid[rowNum] = Array(5); // declare 5 elements per row

                if (this.photo[i]) { // check file URI exists
                    this.grid[rowNum][0] = this.sanitizer.bypassSecurityTrustUrl(this.photo[i].photo.webPath); // insert image
                    console.log(this.grid[i][0]);
                }

                if (this.photo[i + 1]) { // repeat for the 2nd image
                    this.grid[rowNum][1] = this.sanitizer.bypassSecurityTrustUrl(this.photo[i + 1].photo.webPath);
                }

                if (this.photo[i + 2]) { // repeat for the 3rd image
                    this.grid[rowNum][2] = this.sanitizer.bypassSecurityTrustUrl(this.photo[i + 2].photo.webPath);
                }

                if (this.photo[i + 3]) { // repeat for the 4th image
                    this.grid[rowNum][3] = this.sanitizer.bypassSecurityTrustUrl(this.photo[i + 3].photo.webPath);
                }

                if (this.photo[i + 4]) { // repeat for the 5th image
                    this.grid[rowNum][4] = this.sanitizer.bypassSecurityTrustUrl(this.photo[i + 4].photo.webPath);
                }

                rowNum++; // go on to the next row
            }
        }
    }

    openPhoto() {
        this.navCtrl.push(this.photoPageComponent, {
            callback: this.photoCallback
        });
    }

    barcodeCallback = (data: Barcode) => {
        if (data.cancelled !== 1) {
            this.barcode.push(data);
        }
    }

    openBarcode() {
        this.navCtrl.push(this.barcodePageComponent, {
            callback: this.barcodeCallback
        });
    }

    qrcodeCallback = (data: Barcode) => {
        if (data.cancelled !== 1) {
            this.qrcode.push(data);
        }
    }

    openQrcode() {
        this.navCtrl.push(this.qrcodePageComponent, {
            callback: this.qrcodeCallback
        });
    }

    datafieldsCallback = (data: any) => {
        this.datafields = data;
    }

    openDatafields() {
        this.navCtrl.push(this.datafieldsPageComponent, {
            data: this.datafields,
            callback: this.datafieldsCallback
        });
    }

    headerCallback = (data: any) => {
        this.header = data.formData;
        this.header._files = data.files;
        this.header._truckNoPhoto = data.truckNoPhoto;
        this.header._preUnloadPhoto = data.preUnloadPhoto;
        this.validationStatus.headerValid = data.valid;
    }

    openHeader() {
        console.log(this.header);
        this.validationStatus.headerValid = false;
        this.navCtrl.push(this.headerPageComponent, {
            data: { formData: this.header, files: (this.header._files ? this.header._files : []), truckNoPhoto: this.header._truckNoPhoto, preUnloadPhoto: this.header._preUnloadPhoto },
            callback: this.headerCallback
        });
    }

    addArticle() {
        this.articles.push( { itemName: 'New'} );
        this.validationStatus.articleValid.push(false);
        this.openArticle(this.articles[this.articles.length - 1], this.articles.length - 1);
    }

    removeArticle(i) {
        this.articles.splice(i, 1);
    }

    articleCallback = (data: any) => {
        this.articles[data.index] = data.formData;
        this.articles[data.index]._files = data.files;
        if (!this.header.slTime) {
            this.header.slTime = 0;
        }
        this.header.slTime = this.header.slTime + this.articles[data.index].slMinutes;
        this.validationStatus.articleValid[data.index] = data.valid;
        // this.validateReport();
    }

    openArticle(article, index) {
        this.navCtrl.push(this.articlePageComponent, {
            data: { formData: article, files: (article._files ? article._files : []), index },
            callback: this.articleCallback
        });
    }

    submitReport() {
        this.createflowService.createCase(this.header, this.articles)
            .subscribe(
                next => {
                    this.reset();
                },
                error1 => {
                    console.error(error1);
                }
            );
    }

    reset() {
        this.photo = [];
        this.barcode = [];
        this.qrcode = [];
        this.header = {};
        this.articles = [];
        this.grid = undefined;
        this.validationStatus = new ValidationStatus().deserialize(
            {
                headerValid: false,
                articleValid: []
            }
        );
    }

    reportValid = () => {
        // Flow is valid if header complete and all articles valid.
        if (this.validationStatus.headerValid) {
            if (this.validationStatus.articleValid.find(articleStatus => !articleStatus)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    ngOnInit() {
    }

}
