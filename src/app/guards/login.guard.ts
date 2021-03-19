import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RegistroService } from '../services/registro.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private navctrl:NavController,private srvRegistro:RegistroService){
  }
  async canActivate():Promise<boolean>{
    const userdata = await this.srvRegistro.getUserData();
    if( userdata){
      return true;
    }
    this.navctrl.navigateRoot('login', {animated: true});
   return false;
  }
}
