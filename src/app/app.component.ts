import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PushService } from './services/push.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private push:PushService,
  ) {
    this.initializeApp();
  }
  initializeApp() {

    this.platform.ready().then(() => {
      this.push.configuracionPush();
      this.statusBar.styleLightContent();
        this.splashScreen.hide();
        this.backbuttonSubscribeMethod();
      });
    // this.statusBar.overlaysWebView(true);
  }
  backbuttonSubscribeMethod() {
  var a = 0;
   
    this.platform.backButton.subscribe(() => {
        a++;
        if (a == 2) { // logic for double tap
          navigator['app'].exitApp();
        }
    });
  }
}
