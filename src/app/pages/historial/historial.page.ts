import { ApplicationRef, Component, OnInit } from '@angular/core';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { AdditionalData } from 'src/app/models/notify';

import { PushService } from '../../services/push.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalController } from '@ionic/angular';
import { Ciudadano, Ubicacion } from '../../models/ciudadano';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  mensaje:OSNotificationPayload[]=[]

  notificaciones:AdditionalData[]=[]
  valor=[1,2,3,4]
 
  ciudadano:Ciudadano=new Ciudadano();
  
  constructor(private pushService:PushService,private appref:ApplicationRef,private modalController:ModalController) { }
   ngOnInit() {
         this.pushService.pushListener2.subscribe((noty)=>{
         this.notificaciones.unshift(noty);
        this.appref.tick();
       })

  }



 async eliminar(){
      await this.pushService.vaciarLocalStorage();  
       this.notificaciones=[];
  }

  async ionViewWillEnter(){
    this.notificaciones= await this.pushService.getMensajes2();
  }

  disteClick(index){
    this.ciudadano.ubicacion=new Ubicacion();
    var noty=this.notificaciones[index];
    console.log('noty:',noty);
    this.ciudadano.nombre=noty.payload.additionalData.nombre;
    this.ciudadano.apellido=noty.payload.additionalData.apellido
    this.ciudadano.telefono=noty.payload.additionalData.telefono
    this.ciudadano.direccion=noty.payload.additionalData.direccion
    this.ciudadano.ubicacion.coordinates=noty.payload.additionalData.ubicacion.coordinates
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
       component: ModalComponent,
       componentProps:{
         ciudadano:this.ciudadano
       }
    });
    return await modal.present();
  }
  
  

}
