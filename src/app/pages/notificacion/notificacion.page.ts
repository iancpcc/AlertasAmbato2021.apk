import { Component, ElementRef, OnInit, ViewChild, ApplicationRef } from '@angular/core';

// import { HomePage } from '../home/home.page';
import { Ciudadano, Ubicacion } from '../../models/ciudadano';
import { AdditionalData } from '../../models/notify';

import * as L from 'leaflet';
import { PushService } from '../../services/push.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.page.html',
  styleUrls: ['./notificacion.page.scss'],
})
export class NotificacionPage implements OnInit {

  map: L.Map;

  @ViewChild('map',{static: true}) mapContainer: ElementRef;

  constructor(private pushService:PushService,private appref:ApplicationRef,private navCtrl:NavController)
     { }
  ciudadano:Ciudadano=new Ciudadano();
  notificacion:AdditionalData
  contador=0
coordenadas=[];

   ngOnInit() {
    this.ciudadano.ubicacion=new Ubicacion();
       this.pushService.pushListener3.subscribe(noty=>{
      this.ciudadano.nombre=noty.payload.additionalData.nombre
          this.ciudadano.apellido=noty.payload.additionalData.apellido
          this.ciudadano.telefono=noty.payload.additionalData.telefono
          this.ciudadano.direccion=noty.payload.additionalData.direccion
          this.ciudadano.ubicacion.coordinates=noty.payload.additionalData.ubicacion.coordinates
        this.coordenadas=[this.ciudadano.ubicacion.coordinates[0],this.ciudadano.ubicacion.coordinates[1]];
        this.appref.tick();
       
      })
    }
   async ionViewWillEnter(){
      const sms= await this.pushService.cargarMensajes();
      this.notificacion=sms[0];
      this.ciudadano.nombre=this.notificacion.payload.additionalData.nombre;
      this.ciudadano.apellido=this.notificacion.payload.additionalData.apellido
      this.ciudadano.telefono=this.notificacion.payload.additionalData.telefono
      this.ciudadano.direccion=this.notificacion.payload.additionalData.direccion
      this.ciudadano.ubicacion.coordinates=this.notificacion.payload.additionalData.ubicacion.coordinates
      this.coordenadas=[this.ciudadano.ubicacion.coordinates[0],this.ciudadano.ubicacion.coordinates[1]];
      this.cargarMapa();
      setTimeout(() => { 
        this.navCtrl.navigateRoot('tabs/home', {animated: true});
      }, 120000);

  }
  async cargarMapa(){
    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
    this.map = L.map(this.mapContainer.nativeElement).setView([this.ciudadano.ubicacion.coordinates[0],this.ciudadano.ubicacion.coordinates[1]], 17);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    L.marker([this.ciudadano.ubicacion.coordinates[0],this.ciudadano.ubicacion.coordinates[1]],{draggable: true}).addTo(this.map);
    
  }
  
    ionViewWillLeave(){
      this.map.remove();
    }
   
  
}
