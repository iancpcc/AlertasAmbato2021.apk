export class Ciudadano{
    id?:number;
    nombre?: string;
    apellido?: string;
    cedula?: string;
    email?:string;
    password?:string;
    telefono?:number;
    token?:string;
    ubicacion?: Ubicacion;
    idPerfil?:number = 1;
    direccion:string;
    constructor(){
      this.ubicacion = new Ubicacion();
    }
    
}

export class Usuario{
    email?:string;
    password?:string;
    tokenDispositivo?:string;
}


 export class Ubicacion {
  type?: string="Point"
  coordinates?: number[]=[0,0]

  constructor(){
    
  }

}