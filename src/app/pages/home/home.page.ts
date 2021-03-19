import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { PushService } from '../../services/push.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RegistroService } from '../../services/registro.service';
import { Ciudadano } from '../../models/ciudadano';
import { AlertController } from '@ionic/angular';
import { ContactosService } from '../../services/contactos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild("imgPanic") imgPanic: ElementRef
  
  constructor(public push: PushService,
    private registerService: RegistroService,
    private srvContantos: ContactosService,
    private geolocation: Geolocation,
    private alertController: AlertController,
    private renderer: Renderer2,
  ) {
  //  this.ciudadano = this.registerService.datosCiudadano;
  }
  ciudadano: Ciudadano = new Ciudadano();
  cargandoGeo = false;
  objecto: any = { lat: 0, long: 0, radio: 0, telefono: [] }
  alert: any;
  radio: number = 200;
  buscarPosicion: boolean

   ngOnInit() {
    this.ciudadano =   this.registerService.datosCiudadano|| new Ciudadano();
  }

  async presentAlert(mensaje: string, title: string, message?: string) {
    this.alert = await this.alertController.create({
      header: title,
      subHeader: mensaje,
      message: message,
      animated: true,
      backdropDismiss: false,
    });

    await this.alert.present();
  }

  async actionHelp() {
    const telefono = this.srvContantos.contactos.map((res) => res.numero);
    if (this.radio <= 0 || this.radio > 2000) {
      await this.presentAlert("La distancia no puede ser 0 o mayor a 2000", "Aviso");
      setTimeout(() => {
        this.alert.dismiss();
      }, 2000);
      return;
    }

    try {
      this.objecto.lat = this.ciudadano.ubicacion.coordinates[0];
      this.objecto.long = this.ciudadano.ubicacion.coordinates[1];
      this.objecto.radio = this.radio;
      this.objecto.telefono = telefono;

      this.renderer.addClass(this.imgPanic.nativeElement, "btnPanic");// Desactivando imagen panico

      await this.presentAlert("Enviando Señal de auxilio", "Aviso");

      const respuesta: any = await this.registerService.enviarNotificacionAyuda(this.ciudadano.id, this.objecto)

      this.alert.dismiss();
      console.log('RespuestaÑ',respuesta);
      if (respuesta.error && respuesta.response) {
       await this.presentAlert('No se han encontrado dispositivos cercanos!!', "Aviso");
       setTimeout(() => {
         this.alert.dismiss();
       }, 2000);
     }
       else if (respuesta.error) {
        await this.presentAlert('No se han encontrado dispositivos cercanos', "Aviso");
        setTimeout(() => {
          this.alert.dismiss();
        }, 2000);
      }

      else {
        await this.presentAlert(`Notificacion Enviada a ${respuesta.data.recipients} dispositivo/s cercanos`, "Aviso", "Espere 10 segundos...");
        this.renderer.addClass(this.imgPanic.nativeElement, "btnPanic");//Si se envia la notificacion espero 10s
        setTimeout(() => {
          this.alert.dismiss();
        }, 10000);
      }
      this.renderer.removeClass(this.imgPanic.nativeElement, "btnPanic");

    } catch (error) {
      this.alert.dismiss();
      this.presentAlert("Ha ocurrido un error en el envio de la notificacion", "Error");
      setTimeout(() => {
        this.alert.dismiss();
        this.renderer.removeClass(this.imgPanic.nativeElement, "btnPanic");
      }, 2000);
    }

  }

  obtenerPosicion() {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000
    };

    if (this.buscarPosicion) {
      this.cargandoGeo = true;
      this.geolocation.getCurrentPosition(options).then((resp) => {
        this.ciudadano.ubicacion.coordinates = [resp.coords.latitude, resp.coords.longitude];
        this.cargandoGeo = false;

      }, (error) => {
        this.buscarPosicion = false;
        this.cargandoGeo = false;
      }

      ).catch((error) => {
        this.buscarPosicion = false;
        this.cargandoGeo = false;
      }

      );

    }
  }





}
