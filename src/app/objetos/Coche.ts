
export class Coche {

    constructor(
        public marca: string, 
        public modelo: string, 
        public matricula: string,
        public urlfotos: string,
        public combustible:string,
        public transmision:string,
        public numasientos:string,
        public comunidad:string,
        public provincia:string,
        public ciudad: string,
        public longitud:string,
        public latitud:string) {}

    

    public setLongitud(longitud: string) {

        this.longitud = longitud;

    }

    public getLongitud(): string {

        return this.longitud;

    }

    public setLatitud(latitud: string) {

        this.latitud = latitud;

    }

    public getLatitud(): string {

        return this.latitud;

    }

    
    

    }