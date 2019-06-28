import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {IonItemSliding, IonNav, NavController, NavParams} from '@ionic/angular';
import {Attachment} from '../models/attachment';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {PhotoPage} from '../photo/photo.page';

@Component({
    selector: 'app-attachments',
    templateUrl: 'attachments.page.html',
    styleUrls: ['attachments.page.scss']
})
export class AttachmentsPage implements OnInit, OnChanges {

    @Input() attachments: Attachment[];
    @Output() attachmentsChanges: EventEmitter<Attachment[]> = new EventEmitter<Attachment[]>();

    private imagePreviews: SafeResourceUrl[] = [];
    private attribName: string;
    private photoPageComponent = PhotoPage;

    constructor(public navCtrl: IonNav, public navParams: NavParams, private sanitizer: DomSanitizer) {
    }

    changeAttachment = () => {
        this.attachmentsChanges.emit(this.attachments);
    }

    removeImage(index: number) {
        this.attachments.splice(index, 1);
        this.imagePreviews.splice(index, 1);
        this.attachmentsChanges.emit(this.attachments);
    }

    addImage(attachment: Attachment) {

        console.log('prepush:', this.attachments);
        this.attachments.push(attachment);
        this.imagePreviews.push(this.sanitizer.bypassSecurityTrustUrl(attachment.file.webPath));
        console.log('pushed:', attachment);
        this.attachmentsChanges.emit(this.attachments);
    }

    photoCallback = data => {
        if (data.photo) {
            this.addImage(new Attachment().deserialize(
                {
                    type: 'photo',
                    file: data.photo,
                    description: data.photo.path.substr(data.photo.path.lastIndexOf('/') + 1)
                })
            );
        }
    };

    openPhoto() {
        this.navCtrl.push(this.photoPageComponent, {
            data: 'attachment',
            callback: this.photoCallback
        });
    }

    ngOnInit(): void {
        console.log('init attachments2:', this.attachments);
        if (this.attachments && this.attachments.length > 0) {
            this.attachments.forEach(attachment => {
                this.imagePreviews.push(this.sanitizer.bypassSecurityTrustUrl(attachment.file.webPath));
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('changes:', changes);
    }


}
