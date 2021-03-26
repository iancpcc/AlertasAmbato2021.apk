import { Component, ViewChild } from '@angular/core';

import { IonRouterOutlet, Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PushService } from './services/push.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private push: PushService,
    private alertController: AlertController,
    private location: Location
  ) {
    this.initializeApp();
    this.backbuttonSubscribeMethod();
  }

   initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleLightContent();
        this.push.configuracionPush();
    });
  }

  backbuttonSubscribeMethod() {

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.presentAlert("Desea salir de la aplicación?", "Aviso");
      }
      else {
        this.location.back();
      }
    })

  }
  async presentAlert(mensaje: string, title: string) {
    const alert = await this.alertController.create({
      header: title,
      message: mensaje,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Salir',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });

    await alert.present();
  }
}
