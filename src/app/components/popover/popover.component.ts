import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactosService } from '../../services/contactos.service';
import { ValidacionesService } from '../../services/validaciones.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private popverCtrl:PopoverController,private formBuilder:FormBuilder,
    private contactosService:ContactosService,
    private validarSrv:ValidacionesService
    ) { }
  miformulario: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    numero: ['', [Validators.required, Validators.pattern(this.validarSrv.soloNumeros)]],
  },{
    validators:[this.contactosService.existeContacto()]
  }
  
  );

  cancelar(){
    this.popverCtrl.dismiss();
  }


  ngOnInit() {

  }

  camposValidos(): boolean {
    return this.miformulario.errors && this.miformulario.touched;
  }

  guardar(){
    this.popverCtrl.dismiss({
      nombre:this.miformulario.controls["nombre"].value,
      numero:this.miformulario.controls["numero"].value,
    })
  }

 
  



}
