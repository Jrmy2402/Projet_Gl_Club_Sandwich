import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ListMenuPage } from '../pages/list-menu/list-menu';
import { ChargementPage } from '../pages/chargement/chargement'

import { Firebase } from '../providers/firebase';
import { UserModel } from '../models/user'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('myNav') nav: NavController

  rootPage;
  loader: any;

  pages: Array < {
    title: string,
    component: any
  } > ;

  constructor(public userModel: UserModel, public platform: Platform, public firebase: Firebase, public loadingCtrl: LoadingController) {
    this.initializeApp();

    // this.firebase.init();
    // used for an example of ngFor and navigation
    this.pages = [{
        title: 'Login',
        component: LoginPage
      },
      {
        title: 'Signup',
        component: SignupPage
      },
      {
        title: 'ListMenu',
        component: ListMenuPage
      },
      {
        title: 'ChargementPage',
        component: ChargementPage
      }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  ngOnInit() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loader.present();
    this.firebase.onAuthStateChanged().subscribe((resp) => {
      if (resp) {
        this.loader.dismiss();
        this.userModel.setUser(resp);
        console.log("this.infoUser : ", this.userModel.getUser());
        this.rootPage = ListMenuPage;
        if(this.nav.last() && this.nav.last().component.name !== "ListMenuPage"){
           this.nav.push(ListMenuPage);
        }
      } else {
        this.loader.dismiss();
        this.userModel.setUser({});
        this.rootPage = HomePage;
        if (this.nav.last() && this.nav.last().component.name !== "HomePage") {
          this.nav.push(HomePage);
        }
      }
    });
  }

}

