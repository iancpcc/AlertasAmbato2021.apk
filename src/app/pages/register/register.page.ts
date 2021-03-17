import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { Ciudadano } from '../../models/ciudadano';
import { RegistroService } from '../../services/registro.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//Geo
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ValidacionesService } from 'src/app/services/validaciones.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  ciudadano: Ciudadano
  cargandoGeo = false;

  //Opciones para el GPS 
  options: NativeGeocoderOptions = {
    useLocale: false,
    maxResults: 2
  };
  //

  //Validaciones
  miformulario: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern(this.srvValidaciones.soloLetras)]],
    apellido: ['', [Validators.required, Validators.pattern(this.srvValidaciones.soloLetras)]],
    cedula: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10),
    Validators.pattern(this.srvValidaciones.soloNumeros), this.srvValidaciones.validarCedulaFormulario]],
    telefono: ['', Validators.required],
    ubicacion: [''],
    direccion: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
  }
    , {
      validators: [this.srvValidaciones.contraseniasIguales()],
    }

  )

 


  loading: HTMLIonLoadingElement
  encontroUbicacion: boolean
  alert: any
  constructor(
    private navCtrl: NavController,
    private service: RegistroService,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public loadingController: LoadingController,
    private platform: Platform,
    private formBuilder: FormBuilder,
    private srvValidaciones: ValidacionesService
  ) {

    this.platform.backButton.subscribe((res) => {
      this.navCtrl.navigateRoot('login', { animated: true });
    });
  }



  ngOnInit() {
    this.ciudadano = new Ciudadano();
    // this.ciudadano.ubicacion = new Ubicacion();
  }

  camposValidos(campo: string): boolean {
    return this.miformulario.controls[campo].errors && this.miformulario.controls[campo].touched;
  }

  get smsErrorCedula() {
    const errors = this.miformulario.get("cedula").errors;
    if (errors?.required) {
      return 'Cédula Necesaria'
    }
    else if (errors?.pattern) {
      return 'Cédula no tiene el formato correcto'
    }
    else if (errors?.minlength) {
      return "Cédula debe tener 10 caracteres"
    }
    else if (errors?.cedInvalida) {
      return "Cédula Incorrecta"
    }
  }

  async register() {
    const { nombre, apellido, direccion, email, password, telefono, ubicacion, cedula } = this.miformulario.value;
    this.ciudadano = this.miformulario.value;
    this.ciudadano = new Ciudadano();
    this.ciudadano.nombre = nombre.trim();
    this.ciudadano.apellido = apellido.trim();
    this.ciudadano.cedula = cedula.trim();
    this.ciudadano.direccion = direccion.trim();
    this.ciudadano.email = email.trim();
    this.ciudadano.telefono = telefono.trim();
    this.ciudadano.password = password.trim();
    this.ciudadano.ubicacion.coordinates = ubicacion;
    await this.presentLoading();
    this.service.registrar(this.ciudadano).then((res: any) => {
      this.loading.dismiss();
      if (res != false) {
        if (res.data.status == "ok") {
          this.presentAlert(res.data.msg, "Registro");
          this.navCtrl.navigateRoot('login', { animated: true });
        }
      }
      else {
        this.presentAlert('No se encontro el ID del dispositivo. Cierre la aplicación e intente nuevamente', "Error");
      }
    }, (error) => {
      this.loading.dismiss();

      if (error.statusText == "Unknown Error") {
        this.presentAlert("No se pudo conectar con el servidor", "Servidor")
      }
      else {
        this.presentAlert(error.error.msg, "Registro");
      }
    }

    );
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Por favor Espere...',
    });
    await this.loading.present();
  }


  regresar() {
    this.navCtrl.navigateRoot('login', { animated: true });
  }


  async presentAlert(mensaje: string, title: string, message?: string) {
    this.alert = await this.alertController.create({
      header: title,
      subHeader: mensaje,
      message: message,
      animated: true,
      backdropDismiss: true,
      // buttons: ['OK']
    });

    await this.alert.present();
  }

  async obtenerPosicion() {
    this.cargandoGeo = true;
    const options = {
      enableHighAccuracy: true,
      timeout: 10000
    };

    await this.geolocation.getCurrentPosition(options).then((resp) => {
      this.ciudadano.ubicacion.coordinates = [resp.coords.latitude, resp.coords.longitude]
      this.miformulario.controls["ubicacion"].setValue(this.ciudadano.ubicacion.coordinates);
      this.obtenerDirerccion(resp.coords.latitude, resp.coords.longitude)
      this.cargandoGeo = false;

    }, (error) => {
      this.cargandoGeo = false;
      this.presentAlert("Si no carga la UBICACIÓN  active el GPS de su dispositivo e intente de nuevo", "Aviso");
    }

    ).catch((error) => {
      this.cargandoGeo = false;
      this.presentAlert("Si no carga la UBICACIÓN  active el GPS de su dispositivo e intente de nuevo", "Aviso");
    }

    )

  }


  obtenerDirerccion(lat: number, lon: number) {

    this.nativeGeocoder.reverseGeocode(lat, lon, this.options)
      .then((result: NativeGeocoderResult[]) => {

        let address = JSON.stringify(result[1].thoroughfare || result[0].thoroughfare)
        var direccion = address.replace(/"/g, '');
        if (direccion.length == 0) {
          this.presentAlert("Si no carga la dirección ingresela manualmente", "Aviso");

        }
        this.ciudadano.direccion = direccion;
        this.miformulario.controls["direccion"].setValue(this.ciudadano.direccion);

      }
      )
      .catch((error: any) => {
        this.cargandoGeo = false;
        this.presentAlert("Si no carga la dirección ingresela manualmente", "Aviso");

      });
  }

}
