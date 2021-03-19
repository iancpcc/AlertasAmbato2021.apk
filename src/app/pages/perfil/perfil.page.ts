import { Component, OnInit, ViewChild } from '@angular/core';
import { PushService } from '../../services/push.service';
import { ToastController, NavController, PopoverController, IonItemSliding, IonInput } from '@ionic/angular';
import { Ciudadano } from '../../models/ciudadano';
import { PopoverComponent } from '../../components/popover/popover.component';
import { ContactosService } from 'src/app/services/contactos.service';
import { RegistroService } from '../../services/registro.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ValidacionesService } from '../../services/validaciones.service';
import { CiudadanoService } from '../../services/ciudadano.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  cambioComponente: string = "perfil"
  @ViewChild('ionSliding') ionSliding: IonItemSliding
  @ViewChild('email') emailInput: IonInput
  @ViewChild('direccion') direccionInput: IonInput
  @ViewChild('telefono') telefonoInput: IonInput


  contactos: any[] = []
  ciudadano: Ciudadano = new Ciudadano()
  cargandoGeo = false;
  isEditando = false;
  isEditandoUbicacion = false;
  constructor(public push: PushService,
    public toastController: ToastController,
    private navCtrl: NavController,
    public popoverController: PopoverController,
    private contactsService: ContactosService,
    private srvCiudadano: CiudadanoService,
    private srvRegistro: RegistroService,
    private geolocation: Geolocation,
    private formBuilder: FormBuilder,
  ) {
    this.contactos = this.contactsService.contactos;
    this.ciudadano = this.srvRegistro.datosCiudadano;

  }

  miformulario: FormGroup = this.formBuilder.group({
    cedula: [this.ciudadano.cedula, [Validators.required],],
    telefono: [this.ciudadano.telefono, Validators.required],
    direccion: [this.ciudadano.direccion],
    ubicacion: this.formBuilder.group({
      coordinates: [this.ciudadano.ubicacion.coordinates, [Validators.required]],
      type: ['Point']
    }),
    email: [this.ciudadano.email, [Validators.required, Validators.email]],
  }
  )

  ngOnInit() {
    this.miformulario.reset(this.ciudadano);
  }
  segmentChanged(event: any) {
    this.cambioComponente = event.detail.value;
  }

  editarCampos(event: IonInput) {
    this.isEditando = true;
    if (event.name == "ubicacion") {
      return;
    }
    event.readonly = false;
  }

  async actualizar() {
    const { direccion, ubicacion, email, telefono } = this.miformulario.controls;

    const ciudadano = new Ciudadano();
    ciudadano.id = this.ciudadano.id;
    ciudadano.ubicacion = ubicacion.value;

    if (direccion.dirty) {
      ciudadano.direccion = direccion.value.toString().trim();
    }

    if (email.dirty) {
      ciudadano.email = email.value.toString().trim();
    }
    if (telefono.dirty) {
      ciudadano.telefono = telefono.value.toString().trim();
    }

    if (this.miformulario.valid && this.miformulario.dirty) {
      this.isEditando = false;
      try {
        const response = await this.srvCiudadano.actualizarUsuario(ciudadano);
        if (response) {
          if (email.dirty) {
            this.presentToast('Se ha actualizado los datos, Inicie sesión nuevamente');
            this.exit();
            return;
          }
          this.presentToast('Se ha actualizado los datos', 'success');
          this.isEditandoUbicacion=false;
          this.isEditando=false;
          this.ciudadano = response;
          this.miformulario.reset(this.ciudadano);
          this.srvRegistro.ciudadanoInfoset=this.ciudadano;
        }

      } catch (error) {
        this.isEditandoUbicacion=false;
        this.isEditando=false;
        this.presentToast('Error al actualizar los datos');
      }

    }
    else {
      this.presentToast('No ha hecho cambios');
    }


  }


  async presentToast(mensaje: string, clor = "secondary") {
    const toast = await this.toastController.create({
      message: mensaje,
      color: clor,
      position: "bottom",
      duration: 2000,
      animated: true
    });
    toast.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      translucent: true,
      animated: true,
      backdropDismiss: false,
    });
    await popover.present();
    const datos = await popover.onDidDismiss()
    if (datos.data != undefined) {
      this.agregarContacto(datos)
    }
  }

  async agregarContacto(datos: any) {
    const guardadoOk = await this.contactsService.guardarContacto(datos.data);
    if (!guardadoOk) {
      this.presentToast("Solo se permiten agregar máximo 5 contactos");
      return
    }
  }

  async eliminar(numero: string) {
    this.contactos = await this.contactsService.eliminarContacto(numero);
  }

  async abrirSlide(ion: IonItemSliding) {
    ion.open("end");
  }
  async eliminarTodo() {
    await this.contactsService.eliminarTodo();
    this.contactos = [];
  }

  exit() {
    this.navCtrl.navigateRoot('login', { animated: true });
    this.srvRegistro.logout();
  }


  obtenerPosicion() {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000
    };
    this.cargandoGeo = true;
    this.geolocation.getCurrentPosition(options).then((resp) => {
      const coordenadas = [resp.coords.latitude, resp.coords.longitude]
      const formulario = this.miformulario.get("ubicacion").get("coordinates");
      formulario.setValue(coordenadas);
      formulario.markAsDirty();
      this.cargandoGeo = false;

    }, (error) => {
      this.cargandoGeo = false;
    }

    ).catch((error) => {
      this.cargandoGeo = false;
    }

    );


  }

  cancelar() {
    this.emailInput.readonly = true;
    this.direccionInput.readonly = true;
    this.telefonoInput.readonly = true;
    this.isEditando = false;
    this.isEditandoUbicacion = false;
    this.miformulario.reset(this.ciudadano);
  }

}
