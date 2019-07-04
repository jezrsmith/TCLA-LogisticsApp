import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateflowComponent} from '../createflow/createflow.component';
import {ReceiverInfo} from '../models/receiver';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'report-tab',
  templateUrl: 'report-tab.page.html',
  styleUrls: ['report-tab.page.scss']
})
export class ReportTabPage {
  root = CreateflowComponent;
  receiverInfo: ReceiverInfo;

  constructor(private router: Router, private route: ActivatedRoute, public navCtrl: NavController) {
    this.receiverInfo = route.snapshot.data.receiverDetails;
  }




}
