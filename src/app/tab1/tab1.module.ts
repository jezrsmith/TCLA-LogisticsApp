import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab1Page } from './tab1.page';
import {PhotoPage} from '../photo/photo.page';
import {CreateflowComponent} from '../createflow/createflow.component';
import {BarcodePage} from '../barcode/barcode.page';
import {QrcodePage} from '../qrcode/qrcode.page';
import {DatafieldsPage} from '../forms/datafields/datafields.page';
import {ReceiverDetailsResolver} from '../resolvers/receiver-details.resolver';
import {HeaderPage} from '../forms/header/header.page';
import {AttachmentsPage} from '../attachments/attachments.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', resolve: { receiverDetails: ReceiverDetailsResolver }, component: Tab1Page}])
  ],
  providers: [
      ReceiverDetailsResolver
  ],
  declarations: [Tab1Page, PhotoPage, BarcodePage, QrcodePage, DatafieldsPage, HeaderPage, AttachmentsPage, CreateflowComponent],
  entryComponents: [PhotoPage, BarcodePage, QrcodePage, DatafieldsPage, HeaderPage, AttachmentsPage, CreateflowComponent]
})
export class Tab1PageModule {}
