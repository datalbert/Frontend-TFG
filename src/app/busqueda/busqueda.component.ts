import { Component } from '@angular/core';
import {GoogleMap} from '@angular/google-maps';
import { Loader } from "@googlemaps/js-api-loader"
import { Coche } from '../objetos/Coche';
import { NgFor, NgIf, Time } from '@angular/common';
import { InventarioService } from '../servicios/inventario.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CocheHTML } from '../objetos/CocheHTML';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReservaHtmlcreate } from '../objetos/ReservasHtmlcreate';
import { ReservasService } from '../servicios/reservas.service';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [GoogleMap,NgFor,NgIf,FormsModule],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  
  map!: google.maps.Map;
  additionalOptions = {};
  loader: Loader;

  unsolodia= true;

  distancia: number = 1;

  ciudad!: string;

  fechainicio!: Date;
  fechafinal!: Date;

  

  categoriaseleccionada: boolean = false;

  selectedCocheVer!: CocheHTML | null;

  reservarcoche!: number | null;

  coches: CocheHTML[] = [];

  uniqueAsientos!: number;
  uniqueCombustibles!: string;
  uniqueTransmisiones!: string;

  dateError: boolean = false;

  buscar: boolean = false;

  horainicio!: Time;
  horafinal!: Time;

  crearReserva!: ReservaHtmlcreate;

  reservaexitosa: boolean | null = null;
  errorenreserva: boolean | null = null;
  
  
  constructor(private inventarioService: InventarioService, private sanitizier:DomSanitizer,private reservaService: ReservasService) 
 {
    this.loader = new Loader({
      apiKey: "AIzaSyDHo4dF--LFDlNQ7ut3c4q-iinxKCVsKDc",
      version: "weekly",
      ...this.additionalOptions,
    });

    this.inventarioService.obtenerDisponibles().subscribe(coches => {
      this.coches = coches;
    });
      

    this.loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      this.map = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 36.382515, lng: -6.150913 },
        zoom: 13,
      });
    });
  }

  onSliderChange(event: Event): void {
    this.distancia = (event.target as HTMLInputElement).valueAsNumber;
    //llamar al metodo para que te devuelve los coches en función del rango introducido en la ciudad de búsqueda
  }

  

  filterCochesByAsientos(asientos: number)  {
    if (asientos == 0) {
      this.uniqueAsientos = 0;
    }
    else{
      this.uniqueAsientos=asientos;
      this.inventarioService.filtrarCategorias(this.uniqueAsientos,this.uniqueCombustibles, this.uniqueTransmisiones).subscribe(coches => {
        this.coches = coches;
      });
    }
    this.categoriaseleccionada= true;
    
  }
  
  filterCochesByCombustible(combustible: string)  {
    if(combustible == "") {
      this.uniqueCombustibles = "";
    }
    else{
      this.uniqueCombustibles=combustible;
      
    }
    if (typeof this.uniqueTransmisiones === 'undefined') {
      this.uniqueTransmisiones = "";
    }
    this.inventarioService.filtrarCategorias(this.uniqueAsientos,this.uniqueCombustibles, this.uniqueTransmisiones).subscribe(coches => {
      this.coches = coches;
      coches.forEach(coche => {
        console.log("El coche con"+ coche.marca + " es de "+ coche.combustible);
      });
    });
    
    this.categoriaseleccionada= true;
    
    
  }

  filterCochesByTransmision(transmision: string) {
    if(transmision == "") {
      this.uniqueTransmisiones = "";
    }
    else{
      this.uniqueTransmisiones=transmision;
     
    }
    if (typeof this.uniqueCombustibles === 'undefined') {
      this.uniqueCombustibles = "";
    }
    this.inventarioService.filtrarCategorias(this.uniqueAsientos,this.uniqueCombustibles, this.uniqueTransmisiones).subscribe(coches => {
      this.coches = coches;
    });
    this.categoriaseleccionada= true;
    
  
  }

  limpiarFiltros() {
    this.categoriaseleccionada = false;
    this.uniqueAsientos = 0;
    this.uniqueCombustibles = "";
    this.uniqueTransmisiones = "";
    this.inventarioService.obtenerDisponibles().subscribe(coches => {
      this.coches = coches;
    });
    
  }

  onSubmit(idvehiculo: number) {


    this.crearReserva= new ReservaHtmlcreate(idvehiculo,3,this.fechainicio.toString(),this.fechafinal.toString(),this.horainicio.toString(),this.horafinal.toString(),'Reservado');

    //tendriamos que saber el id del vehículo y el id del usuario
    this.reservaService.crearReserva(this.crearReserva).subscribe({
      next: (response) => {
        // Si el registro es exitoso
        console.log(`Reserva registrada. ${response.message}`);
        this.reservaexitosa = true;
        //recargar la página
        window.location.reload();
      },
      error: (error) => {
        // Si el registro falla
        console.error(`Error al registrar la reserva: ${error}`);
        this.errorenreserva = true;
      }
    });


  }

  buscarPorUbicacion(ciudad: string): void {
    this.ciudad = ciudad;
    this.buscar = true;
    

  }

  // Method to handle the change event
  onRadioChange(value: boolean): void {
    this.unsolodia = value;
  }

  validateDates(): void {
    if (this.fechainicio && this.fechafinal) {
      const startDate = new Date(this.fechainicio);
      const endDate = new Date(this.fechafinal);
      this.dateError = startDate >= endDate;
    } else {
      this.dateError = false;
    }
  }


  /*
  filterCochesByTransmision(transmision: string): CocheHTML[] {
    return this.coches.filter(coche => coche.transmision === transmision);
  }
    */

  
  


  

}

  


