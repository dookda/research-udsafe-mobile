import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReportProvider } from '../providers/report/report';
import { DetailPage } from '../pages/detail/detail';
import { ListPage } from '../pages/list/list';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { LayerPage } from '../pages/layer/layer';
import { AddDataPage } from '../pages/add-data/add-data';
import { IonicStorageModule } from '@ionic/storage';
import { UserProvider } from '../providers/user/user';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    DetailPage,
    ListPage,
    LayerPage,
    LoginPage,
    RegisterPage,
    AddDataPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    DetailPage,
    ListPage,
    LayerPage,
    LoginPage,
    RegisterPage,
    AddDataPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ReportProvider,
    UserProvider
  ]
})
export class AppModule { }
