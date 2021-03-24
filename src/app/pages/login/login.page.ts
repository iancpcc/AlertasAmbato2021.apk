import { Component, OnInit } from '@angular/core';
import {  Usuario } from '../../models/ciudadano';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { RegistroService } from '../../services/registro.service';
import { NgForm } from '@angular/forms';
import { CiudadanoService } from '../../services/ciudadano.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  ciudadano:Usuario;
  ubicacion:string;
  loading:HTMLIonLoadingElement;
  constructor(private navCtrl: NavController,
    private srvCiudadano:CiudadanoService,
    private srvRegistro:RegistroService,
    private alertController:AlertController,
    public loadingController: LoadingController ) { 
    }

   ngOnInit() {
    this.ciudadano = new Usuario();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Validando Datos. Porfavor Espere...',
      // duration: 4000
    });
    await this.loading.present();
   
  }

  async login(form: NgForm){
    if(form.invalid){return}
     await this.presentLoading();
    try {
      var valido= await this.srvRegistro.loguearse(this.ciudadano);
      if(valido){
        this.loading.dismiss();
        await this.srvCiudadano.getUserData();
        this.navCtrl.navigateRoot('tabs', {animated: true});
      }
      
    } catch (error) {
      this.loading.dismiss();
      if(error.error.msg){
        this.presentAlert(error.error.msg,"Login")
      }
      else{
        this.presentAlert("Ha ocurrido un error al iniciar sesión","Login")
      }
    }
  }

  goRegister(){
    this.navCtrl.navigateRoot('register', {animated: true});
  }

  async presentAlert(mensaje:string,title:string) {
    const alert = await this.alertController.create({
      header: title,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

}
