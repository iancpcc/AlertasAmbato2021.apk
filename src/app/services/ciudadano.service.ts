import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ciudadano } from '../models/ciudadano';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { PushService } from './push.service';
@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {
url = environment.url_services;
userToken = ""
  contactos: [] = []
  private _datosCiudadano: Ciudadano = new Ciudadano()
  constructor(private http:HttpClient,
              private storage: Storage,
              private push: PushService,

              ) { 
              }

async actualizarUsuario(ciudadano:Ciudadano){
    return await this.http.put<Ciudadano>(`${this.url}/usuarios/${ciudadano.id}`,ciudadano).toPromise();
}

async getUserData() {
  try {
    this.userToken = await this.obtenerTokenUsuario() || null;
    if (this.userToken) {
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        "userToken": this.userToken
      });
      const response = await this.http.get<Ciudadano>(`${this.url}/usuarios/infoUsuario`, { headers: header }).toPromise();
      this._datosCiudadano = response["data"];
      return this._datosCiudadano;
    }
  } catch (error) {
    this.clearStorage();
    this.push.configuracionPush();
  }
}

async obtenerTokenUsuario() {
  this.userToken = await this.storage.get('userToken')
  return this.userToken;
}

clearStorage() {
  this.storage.clear();
}

async enviarNotificacionAyuda(id: number, object: string) {
  return await this.http.post(`${this.url}/sendNotification/${id}`, object).toPromise();
}

get ciudadanoInfo(){
  return {...this._datosCiudadano};
}

set ciudadanoInfoset(ciudadano: Ciudadano){
  this._datosCiudadano = ciudadano;
}


}
