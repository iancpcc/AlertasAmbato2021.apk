import { Component, Input, OnDestroy, OnInit, ApplicationRef, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leafletmap',
  templateUrl: './leafletmap.component.html',
  styleUrls: ['./leafletmap.component.scss'],
})
export class LeafletmapComponent implements OnInit {
  map: L.Map;
  @ViewChild('map',{static: true}) mapContainer: ElementRef;
  @Input() coordenadas:number[];
  constructor(private appref:ApplicationRef) { }
  ubicaciones:number[]=[0,0]
ngOnInit() {
  this.cargarMapa();
 
  }
  async ionViewWillEnter(){
    this.cargarMapa();
  }

  
  cargarMapa(){
    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
    
    this.map = L.map(this.mapContainer.nativeElement).setView([this.coordenadas[1],this.coordenadas[0]], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    L.marker([this.ubicaciones[1],this.ubicaciones[0]],{draggable: true}).addTo(this.map);

  }
  ionViewWillLeave(){
    this.map.remove();
  }
  

}
