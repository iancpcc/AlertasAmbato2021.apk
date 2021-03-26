import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { CiudadanoService } from '../services/ciudadano.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {

  constructor(private srvCiudadano:CiudadanoService,private router:Router){
  }
  async canLoad():Promise<boolean>{
    const userdata =  await this.srvCiudadano.getUserData();
    if( userdata){
      return true;
    }
    this.router.navigateByUrl('/login',{replaceUrl:true});
  }
}
