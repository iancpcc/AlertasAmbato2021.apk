import { Component } from '@angular/core';
import { CiudadanoService } from '../../services/ciudadano.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage  {

  constructor(private srvCiudadano:CiudadanoService) { 
  }
  

}
