import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { Firebase } from '../../providers/firebase';
import { Repas } from './repas.interface';
import { ModalReservationPage } from '../modal-reservation/modal-reservation';
import { ModalDetailPage } from '../modal-detail/modal-detail';
import { UserModel } from '../../models/user'
import { EditRepasPage } from '../edit-repas/edit-repas';



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
    console.log(this.date);
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
          // debugger
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
        // console.log(this.listRepas);
        // }
      }
      this._zone.run(() => {
        this.listRepas.sort(function(a,b){
          return  a.date - b.date;
        });
      });
      
      console.log("listRepas work");
    }, (err) => {
      console.log("listRepas not work");
    });
  }


  isAdmin() {
    return this.userModel.getUser().role === "admin";
  }

  LogOut () {
    console.log("LogOut");
    this.firebase.logOut().subscribe((resp) => {
      console.log(resp);
      console.log("LogOut work");
      // this.navCtrl.push(ListMenuPage);
    }, (err) => {
      console.log("LogOut not work");
    });
  }

  reserver(repas : Repas){
    console.log(repas);
    let addModal = this.modalCtrl.create(ModalReservationPage, { repas: repas });
    addModal.onDidDismiss(item => {
      if (item) {
        // this.items.add(item);
      }
    })
    addModal.present();
  }

  detail(repas : Repas){
    console.log(repas);
    let addModal = this.modalCtrl.create(ModalDetailPage, { repas: repas });
    addModal.onDidDismiss(item => {
      if (item) {
        // this.items.add(item);
      }
    })
    addModal.present();
  }

  editRepa(repas : Repas){
    console.log(repas);
    let addModal = this.modalCtrl.create(EditRepasPage, { repas: repas });
    addModal.onDidDismiss(item => {
      if (item) {
        // this.items.add(item);
      }
    })
    addModal.present();
  }

}
