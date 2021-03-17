import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterPageModule } from './pages/register/register.module';
import { HomePageModule } from './pages/home/home.module';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { PushService } from './services/push.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

//HTTP
import { HttpClientModule } from '@angular/common/http';
//clipboard
import { HistorialPageModule } from './pages/historial/historial.module';
import { LoginPageModule } from './pages/login/login.module';
import { NativeGeocoder,} from '@ionic-native/native-geocoder/ngx';
import { RegistroService } from './services/registro.service';
import { PerfilPageModule } from './pages/perfil/perfil.module';
import { LoginGuard } from './guards/login.guard';
import { NotificacionPageModule } from './pages/notificacion/notificacion.module';
import { ContactosService } from './services/contactos.service';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    RegisterPageModule,
    LoginPageModule,
    PerfilPageModule,
    HomePageModule,
    NotificacionPageModule,
    HistorialPageModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot()],
    
  providers: [
    NativeGeocoder,
    OneSignal,
    Geolocation,
    PushService,
    RegistroService,
    ContactosService,
    StatusBar,
    LoginGuard,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
