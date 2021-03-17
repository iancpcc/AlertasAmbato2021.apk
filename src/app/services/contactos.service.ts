import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { RegistroService } from './registro.service';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  contactos:any[]=this.srvRegistro.contactos;
  
   constructor(private storage:Storage,private srvRegistro:RegistroService) { 
  }
  existeContacto(){
    return  (formGroup: FormGroup):ValidationErrors|null=>{
      const {nombre,numero}=formGroup?.controls
      const existe = this.contactos.find((res:string)=>res["nombre"]==nombre.value || res["numero"]==numero.value);
      if(!existe){
        return null;
      }
      return {contact:false}}
    }

    
  async guardarContacto(contacto:{}){
    if(this.contactos.length==5)return false;
    this.contactos.push(contacto);
    await this.storage.set("contactos",this.contactos);
    return true;
  }

  async eliminarContacto(numero:string){
    const arrayContactos = [...this.contactos]
    this.contactos= arrayContactos.filter(res=> res["numero"] !=numero)
     await this.storage.set("contactos",this.contactos);
     return this.contactos;
  }
  async eliminarTodo(){
    await this.storage.remove("contactos");
    this.contactos=[];
  }


}
