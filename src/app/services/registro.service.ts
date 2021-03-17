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
    this.getUserData();
    
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
        return this.datosCiudadano;
      }
    } catch (error) {
      this.clearStorage();
      this.push.configuracionPush();
    }
  }


  //TODO:Quitar token
  async loguearse(user: Usuario) {
    user.tokenDispositivo = this.push.clave_ID || "";
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


  guardarTokenUsuario(token: string) {
    this.storage.set('userToken', token);
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
