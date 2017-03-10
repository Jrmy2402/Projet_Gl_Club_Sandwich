import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';

import { ListMenuPage } from '../list-menu/list-menu'


/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {name: string, prenom: string, email: string, password: string} = {
    name: '',
    prenom: '',
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public firebase: Firebase,
  public toastCtrl: ToastController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  doSignup() {
    this.firebase.createUser(this.account.name, this.account.prenom, this.account.email, this.account.password).subscribe((resp) => {
      console.log(resp);
      this.navCtrl.push(ListMenuPage);
    }, (err) => {
       console.error(err);
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
