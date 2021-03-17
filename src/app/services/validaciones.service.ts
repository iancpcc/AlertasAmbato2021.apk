import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }

  soloLetras="[A-Za-z ]*"
  soloNumeros="[0-9]*"

  contraseniasIguales(){

      return  (formGroup: FormGroup):ValidationErrors|null=>{
        const {password,password2}=formGroup?.controls
        if( (password.value===password2.value) && password2.value.length!=0 ){
          password2.setErrors(null)
          return null;
        }
        password2.setErrors({pass:false})
        return {pass:false}}
      }

     validarCedulaFormulario(control:FormControl){
        let cedula=control?.value
          var cad = cedula.toString()
          var total = 0;
          var longitud = cad.length;
          var longcheck = longitud - 1;
          if (cad !== "" && longitud === 10) {
            for (var i = 0; i < longcheck; i++) {
              if (i % 2 === 0) {
                var aux = Number(cad.charAt(i)) * 2;
                if (aux > 9) aux -= 9;
                total += aux;
              } else {
                total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
              }
            }
    
            total = total % 10 ? 10 - total % 10 : 0;

            if(Number(cad.charAt(longitud - 1)) == total){
              return null;
            }
              return {cedInvalida:true};
          }      
    }


    validarCedula(cedula?:any):Boolean {
      if (cedula > 0) {
        var cad = cedula.toString()
        var total = 0;
        var longitud = cad.length;
        var longcheck = longitud - 1;
        if (cad !== "" && longitud === 10) {
          for (var i = 0; i < longcheck; i++) {
            if (i % 2 === 0) {
              var aux = Number(cad.charAt(i)) * 2;
              if (aux > 9) aux -= 9;
              total += aux;
            } else {
              total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
            }
          }
  
          total = total % 10 ? 10 - total % 10 : 0;
  
        return (Number(cad.charAt(longitud - 1)) == total) 
           
        }
      }
     return false;
    }
    

  
}
