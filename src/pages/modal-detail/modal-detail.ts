import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';


/*
  Generated class for the ModalDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-detail',
  templateUrl: 'modal-detail.html'
})
export class ModalDetailPage implements OnInit, OnDestroy {
  
  heure: string;
  isReady: string;
  isPayed: string;
  private repas;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public viewCtrl: ViewController,
  public firebase: Firebase) {
    this.repas = navParams.get('repas');
  }

  ngOnInit () {
    const myReservation = this.repas.reservation[this.firebase.getUserUid()]
    this.heure = myReservation.heure;
    this.isReady = myReservation.isReady ? 'Oui' : 'Non';
    this.isPayed = myReservation.isPayed ? 'Oui' : 'Non';
    this.firebase.eventReservation(this.repas.key).subscribe((resp) => {
      this.heure = resp.heure;
      this.isReady = resp.isReady ? 'Oui' : 'Non';
      this.isPayed = resp.isPayed ? 'Oui' : 'Non';
    });
  }

  ngOnDestroy () {
    this.firebase.closeEventReservation(this.repas.key);
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

}
