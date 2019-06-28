import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateflowComponent} from '../createflow/createflow.component';
import {ReceiverInfo} from '../models/receiver';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  root = CreateflowComponent;
  receiverInfo: ReceiverInfo;

  constructor(private router: Router, private route: ActivatedRoute, public navCtrl: NavController) {
    this.receiverInfo = route.snapshot.data.receiverDetails;
  }




}
