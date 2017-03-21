import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Observable, } from 'rxjs/Rx';
/*
  Generated class for the Firebase provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Firebase {

  rootRef;
  db;
  storage;
  storageRef;
  infoUser: any = {};
  arrayRepas: Array<any> = [];

  constructor() {
    console.log('Hello Firebase Provider');
    this.init();
  }

  init() {
      const fbConf = {
        apiKey: "AIzaSyAldubuEwszkqR19kfl1UB1S7V_IWM7WUg",
        authDomain: "appli-libre-de-choix-isen.firebaseapp.com",
        databaseURL: "https://appli-libre-de-choix-isen.firebaseio.com",
        storageBucket: "appli-libre-de-choix-isen.appspot.com",
        messagingSenderId: "147932369067"
      };

      firebase.initializeApp(fbConf);
      console.log('Hello Firebase init');
      this.db = firebase.database();
      this.storage = firebase.storage();
      this.storageRef = this.storage.ref();
      

  }

  createUser(nom: string, prenom: string, email: string, password: string) {
    return Observable.create((observer: any) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((data: any) => {
        this.writeUserData(data.uid, nom, prenom, email);
        observer.next(data);
        observer.complete();
      }).catch((err: any) => {
        observer.error(err);
      });
    });
  }

  eventReservation (date: string) {
    return Observable.create((observer: any) => {
      let listReservation = this.db.ref('reservation/'+date+'/'+this.getUserUid());
      listReservation.on('value', res => {
        observer.next(res.val());
      });
    });
  }

  eventReservationAdmin (date: string) {
    return Observable.create((observer: any) => {
      let listReservation = this.db.ref('reservation/'+date);
      listReservation.on('value', res => {
        observer.next(res.val());
      });
    });
  }

  closeEventReservation (date: string) {
      let listReservation = this.db.ref('reservation/'+date+'/'+this.getUserUid());
      listReservation.off('value')
  }

  closeEventReservationAdmin (date: string) {
      let listReservation = this.db.ref('reservation/'+date);
      listReservation.off('value')
  }

  listRepas() {
   
    return Observable.create((observer: any) => {
      const repas = this.db.ref('repas').orderByChild('date');
      let handles = [];
      repas.on('value', snap => {
        for(const v in snap.val()){
          let value = snap.val()[v]
          value.key = v;
          this.arrayRepas[v] = value;
          let listReservation = this.db.ref('reservation/'+v);
          handles.forEach(reser => listReservation.off('value', reser));
          let reservation = listReservation.on('value', res => {
            this.arrayRepas[res.key].reservation = res.val();
            observer.next(this.arrayRepas);
          });
          handles.push(reservation);
        }
      }, err => {
          console.log("The read failed: " + err.code);
      });
    });
  }

  infoUserByKey (keyUser : string){
    return Observable.create((observer: any) => {
      let usersRef = this.db.ref('users/'+keyUser);
      usersRef.once('value', res => {
        observer.next(res);
        observer.complete();
      });
    })
  }

  infoUserReservation( ArrayReservation: Array<any> ) : any {
    let observableBatch = [];
    for(const keyUser in ArrayReservation){
      observableBatch.push( this.infoUserByKey(keyUser) );
    }

    return Observable.forkJoin(observableBatch);
  }
  
  private writeUserData(userId, nom, prenom, email) {
      firebase.database().ref('users/' + userId).set({
          nom: nom,
          prenom: prenom,
          email: email
      }).then(function(snapshot) {
      }, function(error) {
      });
  }

  reservationAdmin (jour: string, heure: string, uid?: string, isReady?: string, isPayed?: string, isServi?: string) {
    firebase.database().ref('reservation/' + jour + '/' + (uid ? uid : firebase.auth().currentUser.uid)).set({
        heure: heure,
        isReady: isReady,
        isPayed: isPayed,
        isServi: isServi
    }).then(function(snapshot) {
    }, function(error) {
    });
  }

  reservation (jour: string, heure: string) {
    firebase.database().ref('reservation/' + jour + '/' + firebase.auth().currentUser.uid).set({
        heure: heure
    }).then(function(snapshot) {
    }, function(error) {
    });
  }

  modifRepas (jour: string, date: number, titre: string, description: string, image: string) {
    return Observable.create((observer: any) => {
      firebase.database().ref('repas/' +jour).set({
          date: date,
          titre: titre,
          description: description,
          photo: image
      }).then(function(snapshot) {
        firebase.database().ref('reservation/' +jour).set({}).then(function(snapshot) {
          observer.next(snapshot);
          observer.complete();
        }, function(error) {
          observer.error(error);
        });
      }, function(error) {
        observer.error(error);
      });
    });
  }

  saveImage (day: string, date : any) {
    return Observable.create((observer: any) => {
      const image = firebase.storage().ref(day);
      let task = image.putString(date, 'data_url');
      task.on('state_changed',(value)=>{
      }, (err)=>{
      }, () =>{
        this.getUrlImage(day).subscribe((resp) => {
          observer.next(resp);
          observer.complete();
        });
      });
    });
  }
  
  getUrlImage(day: string){
    return Observable.create((observer: any) => {
      firebase.storage().ref(day).getDownloadURL().then(function(url) {
        observer.next(url);
        observer.complete();
      }).catch(function(error) {
        // Handle any errors
        observer.error(error);
      });
    });
  }

  getUserUid () {
    return firebase.auth().currentUser.uid;
  }

  login(email: string, password: string) {
    return Observable.create((observer: any) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then((data: any) => {
        observer.next(data);
        observer.complete();
      }).catch((err: any) => {
        observer.error(err);
      });
    });
  }
  onAuthStateChanged(){
    return Observable.create((observer: any) => {
      firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            let userMe = firebase.database().ref('users/'+firebase.auth().currentUser.uid);
            userMe.once('value', res => {
                observer.next(res.val()); 
            });
          } else {
            observer.next();
          }
      });
    });
  }

  logOut () {
    return Observable.create((observer: any) => {
      firebase.auth().signOut().then(function () {
        observer.next();
        observer.complete();
      }, function (error) {
        observer.error();
        observer.complete();
      });
    });
  }

}
