import {Component, OnInit} from '@angular/core';
import {IonNav, NavController, NavParams} from '@ionic/angular';
import {Barcode} from '../../models/barcode';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-photo',
  templateUrl: 'datafields.page.html',
  styleUrls: ['datafields.page.scss']
})
export class DatafieldsPage implements OnInit {
  private dataFg: FormGroup;
  private initdata: any;
  private hide = false;

  constructor(public navCtrl: IonNav, public navParams: NavParams, private formBuilder: FormBuilder) {
    this.initdata = this.navParams.get('data') ? this.navParams.get('data') : {};
    this.dataFg = this.formBuilder.group({
      Description: [this.initdata.Description, Validators.required],
      MoreInfo: [this.initdata.MoreInfo, Validators.required],
    });
  }

  public submitForm() {
    this.hide = true;
    this.navCtrl.pop().then(() => {
      this.navParams.get('callback')(this.dataFg.value);
    });
  }

  ngOnInit(): void {
  }
}
