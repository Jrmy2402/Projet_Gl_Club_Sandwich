import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

// import { ListMenuPage } from '../list-menu/list-menu'

import { Firebase } from '../../providers/firebase';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {email: string, password: string} = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public firebase: Firebase,
  public toastCtrl: ToastController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // Attempt to login in through our User service
  doLogin() {
    this.firebase.login(this.account.email, this.account.password).subscribe((resp) => {
      // this.navCtrl.push(ListMenuPage);
    }, (err) => {
      // this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

      // // Unable to sign up
      let toast = this.toastCtrl.create({
        message: err,
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
    });
  }

}
