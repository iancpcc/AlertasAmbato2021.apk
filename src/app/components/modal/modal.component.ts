import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Ciudadano } from '../../models/ciudadano';
import { ModalController } from '@ionic/angular';
import * as L from 'leaflet';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  map: L.Map;
  @ViewChild('map',{static: true}) mapContainer: ElementRef;
  constructor(private ctrl:ModalController) {


   }
  @Input()ciudadano:Ciudadano;
  coordendas=[];
  ngOnInit() {

  }


  salir(){
    this.ctrl.dismiss();
  }
  async ionViewWillEnter(){
    this.coordendas=[this.ciudadano.ubicacion.coordinates[0],this.ciudadano.ubicacion.coordinates[1]];
      this.cargarMapa();
    }
  
    
    cargarMapa(){
      setTimeout(() => {
        this.map.invalidateSize();
      }, 500);
      
      this.map = L.map(this.mapContainer.nativeElement).setView([this.ciudadano.ubicacion.coordinates[0],this.ciudadano.ubicacion.coordinates[1]], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      L.marker([this.ciudadano.ubicacion.coordinates[0],this.ciudadano.ubicacion.coordinates[1]],{draggable: true}).addTo(this.map);
  
    }
    ionViewWillLeave(){
      this.map.remove();
    }


}
