import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';

/*
  Generated class for the ModalReservation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-reservation',
  templateUrl: 'modal-reservation.html'
})
export class ModalReservationPage {

  public event = {
    timeStarts: '12:00',
  }
  private repas;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public viewCtrl: ViewController,
  public firebase: Firebase) {
    this.repas = navParams.get('repas');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalReservationPage');
  }

  /**
  * The user cancelled, so we dismiss without sending data back.
  */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    // if(!this.form.valid) { return; }
    this.firebase.reservation(this.repas.key, this.event.timeStarts);
    this.viewCtrl.dismiss();
  }

}
