import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { RegistroService } from '../services/registro.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private register:RegistroService,private navctrl:NavController){

  }
  async canActivate():Promise<boolean>{
    const userdata = await this.register.getUserData();
    if( userdata){
      return true;
    }
    this.navctrl.navigateRoot('login', {animated: true});
   return false;
  }
}
