import {Component, ViewChild, NgZone} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import { NavController, ViewController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Camera } from 'ionic-native';
import { Firebase } from '../../providers/firebase';

/*
  Generated class for the ItemCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-repas',
  templateUrl: 'edit-repas.html'
})
export class EditRepasPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;
  loader: any;

  public event = {
    month: '1990-02-19'
  }

  form: FormGroup;
  repas : any;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public viewCtrl: ViewController,
  formBuilder: FormBuilder,
  public firebase: Firebase,
  public alertCtrl: AlertController,
  public loadingCtrl: LoadingController,
  private _zone: NgZone) {
    this.repas = navParams.get('repas');
    var date = new Date(this.repas.date);
    // Hours part from the timestamp
    var day = date.getDate();
    // Minutes part from the timestamp
    var month = date.getMonth() + 1;
    // Seconds part from the timestamp
    var year = date.getFullYear();
    var monthSting: string;
    if(month < 10){
      monthSting = "0" + month;
    } else{
      monthSting = month.toString();
    }
    var daySting: string;
    if(day < 10){
      daySting = "0" + day;
    } else{
      daySting = day.toString();
    }

    // Will display time in 10:30:23 format
    var formattedTime = year + '-' + monthSting + '-' + daySting;
    this.form = formBuilder.group({
        profilePic: ['', Validators.required],
        titre: [this.repas.titre, Validators.required],
        description: [this.repas.description, Validators.required],
        day: [formattedTime, Validators.required]
    });
    const that = this;
    if(this.repas.photo){
      this.toDataUrlXMLH(this.repas.photo, function(base64Img) {
        that.form.patchValue({ 'profilePic': base64Img });
      });
    }

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  getPicture() {
    if (Camera['installed']()) {
      let option = {
        sourceType:Camera.PictureSourceType.CAMERA,
        destinationType:Camera.DestinationType.DATA_URL,
        correctOrientation:false,
        saveToPhotoAlbum:true
      };
      Camera.getPicture(option).then((data) => {
        // alert('Is good' + data);
        this._zone.run(() => {
          this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' +  data });
        });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }


  processWebImage(event) {
    let input = this.fileInput.nativeElement;

    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      if(input.parentNode){
        input.parentNode.removeChild(input);
      }
      var imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  toDataUrlXMLH(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  toDataUrl(src, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      var canvas = (document.createElement('CANVAS') as any);
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = (this as any).height;
      canvas.width = (this as any).width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL();
      callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
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
    if(!this.form.valid) { return; }
    else{
      this.showConfirm();
    }
  }

  compareDate(str1){
    // str1 format should be yyyy/mm/dd. Separator can be anything e.g. / or -. It wont effect
    var yr1   = parseInt(str1.substring(0,4));
    var mon1  = parseInt(str1.substring(5,7));
    var dt1   = parseInt(str1.substring(8,10));
    var date1 = new Date(yr1, mon1-1, dt1, 13, 45);
    return date1;
  }

   showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Modifier le repas ?',
      message: 'Attention toutes les réservations actuelles seront supprimées.',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Modifier',
          handler: () => {
            this.loader = this.loadingCtrl.create({
              content: "Please wait..."
            });

            this.loader.present();
            const date = this.compareDate(this.form.controls['day'].value).getTime();
            this.firebase.saveImage(this.repas.key, this.form.controls['profilePic'].value).subscribe((resp) => {
              this.firebase.modifRepas(this.repas.key, date, this.form.controls['titre'].value, this.form.controls['description'].value, resp).subscribe((resp) => {
                  this.viewCtrl.dismiss();
                  this.loader.dismiss();
              });
            });
          }
        }
      ]
    });
    confirm.present();
  }


}
