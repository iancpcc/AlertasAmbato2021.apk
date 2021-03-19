import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
  datosCiudadano: Ciudadano = new Ciudadano()

  constructor(private http: HttpClient,
    private push: PushService,
    private storage: Storage,
  ) {
    this.cargarContactos();
  }

  get ciudadanoInfo(){
    return {...this.datosCiudadano};
  }

  set ciudadanoInfoset(ciudadano: Ciudadano){
    this.datosCiudadano = ciudadano;
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

  async getUserData() {
    try {
      this.userToken = await this.obtenerTokenUsuario();
      if (this.userToken) {
        const header = new HttpHeaders({
          'Content-Type': 'application/json',
          "userToken": this.userToken
        });
        const response = await this.http.get<Ciudadano>(`${this.url}/usuarios/infoUsuario`, { headers: header }).toPromise();
        this.datosCiudadano = response["data"];
        await this.guardarInfoCiudadano();
        return this.datosCiudadano;
      }
    } catch (error) {
      this.clearStorage();
      this.push.configuracionPush();
    }
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

  async guardarInfoCiudadano (){
    await this.storage.set("ciudadano",this.datosCiudadano);
  } 
  
  async obtenerInfoCiudadano (){
    this.datosCiudadano= await this.storage.get("ciudadano");
    return this.datosCiudadano;
  }

  async obtenerTokenUsuario() {
    this.userToken = await this.storage.get('userToken')
    return this.userToken;
  }

  logout() {
    this.storage.remove("userToken")
  }
  
  clearStorage() {
    this.storage.clear();
  }
  
  async enviarNotificacionAyuda(id: number, object: string) {
    return await this.http.post(`${this.url}/sendNotification/${id}`, object).toPromise();
  }

}
