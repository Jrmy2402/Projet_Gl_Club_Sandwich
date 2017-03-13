import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Repas } from '../list-menu/repas.interface';
import { Firebase } from "../../providers/firebase";

/*
  Generated class for the ListReservation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-reservation',
  templateUrl: 'list-reservation.html'
})
export class ListReservationPage implements OnInit, OnDestroy {

  resultReservation: any;
  repas: Repas;
  reservation: Array<any> = [];
  searchTerm: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, private _zone: NgZone) {
    this.repas = navParams.get('repas');
  }

  ngOnInit(){
    this.firebase.eventReservationAdmin(this.repas.key).subscribe((response) => {
      if(response){
         this.firebase.infoUserReservation(response).subscribe((resp) => {
            this.reservation = [];
            for(const user of resp){
              this.repas.reservation[user.key].infoUser = user.val();
              this.repas.reservation[user.key].key = user.key;
              this.repas.reservation[user.key].isReady = !this.repas.reservation[user.key].isReady ? false : this.repas.reservation[user.key].isReady;
              this.repas.reservation[user.key].isPayed = !this.repas.reservation[user.key].isPayed ? false : this.repas.reservation[user.key].isPayed;
              this.reservation.push(this.repas.reservation[user.key]);
            }
            this._zone.run(() => {
              this.reservation.sort((a,b) => {
                let heurea = new Date("2-11-2012 "+ a.heure);
                let heureb = new Date("2-11-2012 "+ b.heure);
                var isLarger = heurea > heureb;
                return (isLarger as any);
              });
            });
          }, err => {
          }, () => {
          });
      }
    });
  }

  ngOnDestroy () {
    this.firebase.closeEventReservationAdmin(this.repas.key);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListReservationPage');
  }

  toggleChange(reservation: any){
    this.firebase.reservationAdmin(this.repas.key, reservation.heure, reservation.key, reservation.isReady, reservation.isPayed);
  }

}
