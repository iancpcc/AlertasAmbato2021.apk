import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//OneSignal
import { OneSignal } from '@ionic-native/onesignal/ngx';
//
//Servicios
import { PushService } from './services/push.service';
import { RegistroService } from './services/registro.service';
import { ContactosService } from './services/contactos.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//Paginas
import { RegisterPageModule } from './pages/register/register.module';
import { LoginPageModule } from './pages/login/login.module';


//HTTP
import { HttpClientModule } from '@angular/common/http';
//Otros
import { NativeGeocoder,} from '@ionic-native/native-geocoder/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { LoginGuard } from './guards/login.guard';
import { CiudadanoService } from './services/ciudadano.service';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    RegisterPageModule,
    LoginPageModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot()],
    
  providers: [
    NativeGeocoder,
    CiudadanoService,
    OneSignal,
    Geolocation,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
