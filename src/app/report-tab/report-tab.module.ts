import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ReportTabPage } from './report-tab.page';
import {PhotoPage} from '../photo/photo.page';
import {CreateflowComponent} from '../createflow/createflow.component';
import {BarcodePage} from '../barcode/barcode.page';
import {QrcodePage} from '../qrcode/qrcode.page';
import {DatafieldsPage} from '../forms/datafields/datafields.page';
import {ReceiverDetailsResolver} from '../resolvers/receiver-details.resolver';
import {HeaderPage} from '../forms/header/header.page';
import {AttachmentsPage} from '../attachments/attachments.page';
import {ArticlePage} from '../forms/article/article.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', resolve: { receiverDetails: ReceiverDetailsResolver }, component: ReportTabPage}])
  ],
  providers: [
      ReceiverDetailsResolver
  ],
  declarations: [ReportTabPage, PhotoPage, BarcodePage, QrcodePage, DatafieldsPage, HeaderPage, ArticlePage, AttachmentsPage, CreateflowComponent],
  entryComponents: [PhotoPage, BarcodePage, QrcodePage, DatafieldsPage, HeaderPage, ArticlePage, AttachmentsPage, CreateflowComponent]
})
export class ReportTabPageModule {}
