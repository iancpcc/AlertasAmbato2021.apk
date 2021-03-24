import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ciudadano, Usuario } from '../models/ciudadano';
import { PushService } from './push.service';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private url = environment.url_services;
  userToken = ""
  contactos: [] = []

  constructor(private http: HttpClient,
    private push: PushService,
    private storage: Storage,
  ) {
    this.cargarContactos();
  }

  
  async registrar(ciudadano: Ciudadano) {
    const token = await this.push.obtenerTokenDipositivo();
    ciudadano.token = token;
    return await this.http.post<Ciudadano>(`${this.url}/auth/signup`, ciudadano).toPromise();
  }

  async cargarContactos() {
    this.contactos = await this.storage.get('contactos') || [];
    return this.contactos;
  }


  //TODO:Quitar token
  async loguearse(user: Usuario) {
    user.tokenDispositivo = this.push.clave_ID || "b8ebde51-efea-486b-b47d-52efd0c2ceaa";
    // user.tokenDispositivo = this.push.clave_ID || "";
    return await this.http.post(`${this.url}/auth/login`, user)
      .pipe(
        map(
          (res: any) => {
            const { access_token } = res.data;
            if (access_token) {
              this.guardarTokenUsuario(access_token);
              return true;
            }
          })
        ,
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      ).toPromise()
  }


  async guardarTokenUsuario(token: string) {
    await this.storage.set('userToken', token);
  }

  // async guardarInfoCiudadano (){
  //   await this.storage.set("ciudadano",this.datosCiudadano);
  // } 
  


  logout() {
    this.storage.remove("userToken")
  }
  
  
 

}
