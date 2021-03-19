import { EventEmitter, Injectable } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { AdditionalData } from '../models/notify';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  
  constructor(private oneSignal:OneSignal, 
    private storage:Storage,
    private navCtrl: NavController,
   ) {
      this.cargarMensajes();
      this.obtenerTokenDipositivo();
    }
    clave_ID='';
    url=environment.url_services;
    mensaje:OSNotificationPayload[]=[]
    pushListener2= new EventEmitter<AdditionalData>();
    pushListener3= new EventEmitter<AdditionalData>();
    notificacion=new AdditionalData();
    arrayMensajes:AdditionalData[]=[]
    hora:string;
    fecha:string;
  //TODO: Obtener Id desde la BD

     configuracionPush(){
      this.oneSignal.startInit('6ef9203e-3222-403f-8684-36014672776b', '646345574677');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.handleNotificationReceived().subscribe((sms) => {
         this.notificaionRecibida(sms);

      });

      this.oneSignal.handleNotificationOpened().subscribe(async(sms) => {
        await this.notificaionRecibida(sms.notification);
      this.navCtrl.navigateRoot('tabs/noty', {animated: true});
      });

      this.oneSignal.getIds().then(info=>{
        this.clave_ID=info.userId;
        this.guardarTokenEnDispositivo(info.userId);
      })
      this.oneSignal.endInit();
  }

   guardarTokenEnDispositivo(token:string){
    this.storage.set("tokenDevice",token);
  }
  
  async obtenerTokenDipositivo(){
    this.clave_ID = await this.storage.get('tokenDevice') || '';
    return this.clave_ID;
   }

   async notificaionRecibida(noti:OSNotification){
     await this.cargarMensajes();
    const payload=noti.payload;
    const existePush=this.arrayMensajes.find(sms=>sms.payload.notificationID === payload.notificationID)|| false;
    if(existePush){
      return;
    }

    this.obtenerFechayHoraActuales();
    this.notificacion.payload = payload;
    this.notificacion.fecha = this.fecha;
    this.notificacion.hora = this.hora;
    this.arrayMensajes.unshift(this.notificacion);
    this.pushListener3.emit(this.notificacion);
    this.pushListener2.emit(this.notificacion);
    await  this.guardarMensajes();
   }

   async obtenerFechayHoraActuales(){
     var date=new Date();
     this.fecha=date.toLocaleDateString();
     this.hora=date.toLocaleTimeString();
   }



  async getMensajes(){
  await this.cargarMensajes();
    return [...this.arrayMensajes];
  }

  
 async guardarMensajes(){
   return await this.storage.set('notification', this.arrayMensajes);
  }


  //Cargar Mensajes
   
    async cargarMensajes(){
      this.arrayMensajes = await this.storage.get('notification') || []; 
      return this.arrayMensajes;
     }

     //Fin cargar Mensajes
    async vaciarLocalStorage(){
    // this.arrayMensajes=[];
     return await this.storage.remove('notification');

   }

   
}
