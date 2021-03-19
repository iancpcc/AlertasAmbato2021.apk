import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ciudadano } from '../models/ciudadano';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {
url = environment.url_services;
  constructor(private http:HttpClient) { }


async actualizarUsuario(ciudadano:Ciudadano){
    return await this.http.put<Ciudadano>(`${this.url}/usuarios/${ciudadano.id}`,ciudadano).toPromise();

}


}
