import {Component, OnInit} from '@angular/core';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {IonNav, NavController, NavParams} from '@ionic/angular';
import {FilesystemDirectory, FilesystemEncoding} from '@capacitor/core';
import {FormBuilder} from '@angular/forms';

const {Geolocation, Modals, Filesystem} = Plugins;

@Component({
    selector: 'app-photo',
    templateUrl: 'photo.page.html',
    styleUrls: ['photo.page.scss']
})
export class PhotoPage {

    private data: any = {};

    constructor(public navCtrl: IonNav, public navParams: NavParams) {
        this.data.attribName = this.navParams.get('data') ? this.navParams.get('data') : {};
        this.takePicture(this.data.attribName);
    }

    async takePicture(attribName: string) {
        const image = await Plugins.Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera
        }).catch((e) => {
            console.warn('No photo captured:', e);
        });
        this.navCtrl.pop().then(() => {
            const returnData = { attribName, photo: image };
            this.navParams.get('callback')(returnData);
        });
    }
}
