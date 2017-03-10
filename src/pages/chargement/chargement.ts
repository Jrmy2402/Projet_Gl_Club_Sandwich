import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController  } from 'ionic-angular';

/*
  Generated class for the Chargement page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chargement',
  templateUrl: 'chargement.html'
})
export class ChargementPage {
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChargementPage');
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }
  ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");
    this.loader.dismiss();
  }

}
