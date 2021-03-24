import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CiudadanoService } from '../services/ciudadano.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {

  constructor(private navctrl:NavController,private srvCiudadano:CiudadanoService){
  }
  async canLoad():Promise<boolean>{
    const userdata =  await this.srvCiudadano.getUserData();
    if( userdata){
      return true;
    }
    this.navctrl.navigateRoot('login', {animated: true});
   return false;
  }
}
