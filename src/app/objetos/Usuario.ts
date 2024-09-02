
export class Usuario {

    constructor(
        public nombre: string, 
        public apellido: string, 
        public email: string, 
        public password: string,
        public direccion:string,
        public ciudad:string,
        public provincia:string,
        public codigo_postal:string) {}

    }