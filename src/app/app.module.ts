import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ListMenuPage } from '../pages/list-menu/list-menu';
import { ModalReservationPage } from '../pages/modal-reservation/modal-reservation';
import { ModalDetailPage } from '../pages/modal-detail/modal-detail';
import { UserModel } from '../models/user';
import { EditRepasPage } from '../pages/edit-repas/edit-repas';
import { ListReservationPage } from '../pages/list-reservation/list-reservation';

import { Firebase } from '../providers/firebase';
import { ReservationFilterPipe } from '../pages/list-reservation/list-reservation.pipe';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ListMenuPage,
    ModalReservationPage,
    ModalDetailPage,
    EditRepasPage,
    ListReservationPage,
    ReservationFilterPipe
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
    ModalReservationPage,
    ModalDetailPage,
    EditRepasPage,
    ListReservationPage
  ],
  providers: [
    Firebase,
    UserModel,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

