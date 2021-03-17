import { Component, OnInit, ViewChild } from '@angular/core';
import { PushService } from '../../services/push.service';
import { ToastController, NavController, PopoverController, IonItemSliding } from '@ionic/angular';
import { Ciudadano } from '../../models/ciudadano';
import { PopoverComponent } from '../../components/popover/popover.component';
import { ContactosService } from 'src/app/services/contactos.service';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
cambioComponente:string="perfil"
@ViewChild('ionSliding') ionSliding:IonItemSliding
contactos:any[]=[]
ciudadano:Ciudadano= new Ciudadano()
  constructor(public push:PushService,
    public toastController: ToastController,
    private navCtrl: NavController,
    public popoverController: PopoverController,
    private contactsService:ContactosService,
    private srvRegistro:RegistroService
    ) { 
      this.contactos = this.contactsService.contactos;
      this.ciudadano=  this.srvRegistro.datosCiudadano;
    }

     async ngOnInit() {
      //  this.ciudadano = await this.srvRegistro.getUserData();
  }
  segmentChanged(event:any){
    this.cambioComponente=event.detail.value;
  }

  
  async presentToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color:"primary",
      position:"middle",
      duration: 2000
    });
    toast.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      translucent: true,
      animated:true,
      backdropDismiss:false,
    });
    await popover.present();
    const datos=  await popover.onDidDismiss()
    if(datos.data!=undefined){
      this.agregarContacto(datos)
    }
  }

   async agregarContacto(datos:any){
    const guardadoOk=  await this.contactsService.guardarContacto(datos.data);
    if(!guardadoOk){
      this.presentToast("Solo se permiten agregar máximo 5 contactos");
      return
    }
  }

  async eliminar(numero:string){
    this.contactos = await this.contactsService.eliminarContacto(numero);
  }

  async abrirSlide(ion:IonItemSliding){
     ion.open("end");
  }
  async eliminarTodo(){
    await this.contactsService.eliminarTodo();
    this.contactos =  [];
  }

  exit(){
    this.navCtrl.navigateRoot('login', {animated: true});
    this.srvRegistro.logout();
  }

}
