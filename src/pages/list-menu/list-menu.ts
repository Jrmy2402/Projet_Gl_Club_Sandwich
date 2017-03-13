import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { Firebase } from '../../providers/firebase';
import { Repas } from './repas.interface';
import { ModalReservationPage } from '../modal-reservation/modal-reservation';
import { ModalDetailPage } from '../modal-detail/modal-detail';
import { UserModel } from '../../models/user'
import { EditRepasPage } from '../edit-repas/edit-repas';
import { ListReservationPage } from '../list-reservation/list-reservation';

/*
  Generated class for the ListMenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-menu',
  templateUrl: 'list-menu.html'
})
export class ListMenuPage implements OnInit {

  listRepas : Array<Repas> = [];
  date : Date;
  dateInTimstamp :  Number;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public firebase: Firebase,
  private _zone: NgZone,
  public modalCtrl: ModalController,
  public userModel: UserModel) {
    this.date = new Date();
    this.dateInTimstamp = this.date.getTime();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListMenuPage');
  }

  ngOnInit () {
    // this.userModel = new UserModel();
    this.firebase.listRepas().subscribe((resp) => {
      this.listRepas = [];
      
      for(const key in resp){
        let count = 0;
        if(resp[key].reservation){
          count=Object.keys(resp[key].reservation).length;
          if(resp[key].reservation[this.firebase.getUserUid()]){
            resp[key].isRever = true;
          }else {
            resp[key].isRever = false;
          }
        }else {
          resp[key].isRever = false;
        }
        resp[key].nbreservation = count;
        this.listRepas = [...this.listRepas, resp[key]];
        // }
      }
      this._zone.run(() => {
        this.listRepas.sort(function(a,b){
          return  a.date - b.date;
        });
      });
      
    }, (err) => {
    });
  }

  authorized (date: number) {
    var date2 = new Date(date);
    this.date = new Date();
    console.log(date2, this.date);
    return date2 > this.date
  }

  isAdmin() {
    return this.userModel.getUser().role === "admin";
  }

  LogOut () {
    this.firebase.logOut().subscribe((resp) => {

    }, (err) => {
    });
  }

  reserver(repas : Repas){
    let addModal = this.modalCtrl.create(ModalReservationPage, { repas: repas });
    addModal.present();
  }

  detail(repas : Repas){
    let addModal = this.modalCtrl.create(ModalDetailPage, { repas: repas });
    addModal.present();
  }

  detailAdmin(repas : Repas){
    this.navCtrl.push(ListReservationPage, {
      repas: repas
    });
  }

  editRepa(repas : Repas){
    let addModal = this.modalCtrl.create(EditRepasPage, { repas: repas });
    addModal.present();
  }

}
