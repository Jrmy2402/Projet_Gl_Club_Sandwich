import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ListMenuPage } from '../pages/list-menu/list-menu';
import { ChargementPage } from '../pages/chargement/chargement';
import { ModalReservationPage } from '../pages/modal-reservation/modal-reservation';
import { ModalDetailPage } from '../pages/modal-detail/modal-detail';
import { UserModel } from '../models/user';
import { EditRepasPage } from '../pages/edit-repas/edit-repas';

import { Firebase } from '../providers/firebase';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ListMenuPage,
    ChargementPage,
    ModalReservationPage,
    ModalDetailPage,
    EditRepasPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ListMenuPage,
    ChargementPage,
    ModalReservationPage,
    ModalDetailPage,
    EditRepasPage
  ],
  providers: [
    Firebase,
    UserModel,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

