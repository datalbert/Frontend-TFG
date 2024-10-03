import { Component } from '@angular/core';
import {GoogleMap, MapInfoWindow} from '@angular/google-maps';
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
import { GooglemapsapiService } from '../servicios/googlemapsapi.service';
import { ApiResponse } from '../objetos/Direccion';
import { KeycloakService } from '../authentication/Keycloak.service';

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

  TodasLatitudes: number[] = [];
  TodasLongitudes: number[] = [];

  //valor devuelto por la api de googlemaps
  addressData: ApiResponse | undefined;

  //Almacenar los marcadores en un mapa
  private markersMap: Map<string, google.maps.marker.AdvancedMarkerElement> = new Map();

  
  
  constructor(private inventarioService: InventarioService, private sanitizier:DomSanitizer,private reservaService: ReservasService,
    private googlemapsapi: GooglemapsapiService,
    private keycloak: KeycloakService) 
 {
    this.loader = new Loader({
      apiKey: "AIzaSyDHo4dF--LFDlNQ7ut3c4q-iinxKCVsKDc",
      version: "weekly",
      ...this.additionalOptions,
    });

    this.inventarioService.obtenerDisponibles().subscribe(coches => {
      this.coches = coches;
      
      // Aquí cargamos el mapa después de obtener los coches
      this.loader.load().then(async () => {
        const { Map ,InfoWindow} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  
        this.map = new Map(document.getElementById("map") as HTMLElement, {
          center: { lat: 36.382515, lng: -6.150913 },
          zoom: 13,
          mapId: 'DEMO_MAP_ID',
        });

        const infoWindow = new InfoWindow();
  
        // Recorremos todos los coches disponibles y actualizamos las latitudes y longitudes
        this.coches.forEach(coche => {
          this.TodasLatitudes.push(Number(coche.latitud));
          
          this.TodasLongitudes.push(Number(coche.longitud));

          const position = { lat: Number(coche.latitud), lng: Number(coche.longitud) };
          const marker = new AdvancedMarkerElement({
            map: this.map,
            position: position,
            gmpClickable: true,
            title: `${coche.marca} ${coche.matricula}`,
          });
        
          this.markersMap.set(coche.matricula, marker);

          marker.addListener('click', () => {
            infoWindow.close();
            infoWindow.setContent(marker.title);
            infoWindow.open(marker.map, marker);
        });


        });

        
        
        /*
  
        // Recorremos todas las latitudes y longitudes y las añadimos al mapa
        for (let i = 0; i < this.TodasLatitudes.length; i++) {
          const position = { lat: this.TodasLatitudes[i], lng: this.TodasLongitudes[i] };
          const marker = new AdvancedMarkerElement({
            map: this.map,
            position: position,
            gmpClickable: true,
            title: `Marker ${i}`,
          });



          marker.addListener('click', ({  }) => {
            infoWindow.close();
            infoWindow.setContent(marker.title);
            infoWindow.open(marker.map, marker);
        });


        }
        */
        
      });
    });
  

    
    
  }

  mostrarUbiacionMapa(matricula: string) {
    // Buscar el coche por matrícula
    const marker = this.markersMap.get(matricula);
    if (marker) {
      // Simulamos el evento 'click' del marcador
      google.maps.event.trigger(marker, 'click');
    } else {
      console.error('No se encontró el marcador para la matrícula: ' + matricula);
    }
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

  limbiarBusqueda(){
    this.buscar = false;
    this.inventarioService.obtenerDisponibles().subscribe(coches => {
      this.coches = coches;
    });

  }

  onSubmit(idvehiculo: number) {


    let fechainicio_string= this.fechainicio.toString();

    this.crearReserva= new ReservaHtmlcreate(idvehiculo,this.keycloak.profile?.email|| "",this.fechainicio?.toString(),this.fechafinal?.toString(),this.horainicio?.toString()+":00",this.horafinal?.toString()+":00",'Reservado');

     console.log('La reserva es: '+ this.crearReserva);
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
    
    //1º llamar a geocoding para obtener las coordenadas de la ciudad introducida

    this.googlemapsapi.getCoordenadas(this.ciudad).subscribe(
      (data: ApiResponse) => {
        this.addressData = data;
        const latitudbuscar = this.addressData.results[0].geometry.location.lat.toString();
        const longitudbuscar = this.addressData.results[0].geometry.location.lng.toString();
        console.log('La l,ongitud es :'+ latitudbuscar + ' y la latitud es: ' + longitudbuscar);

        const distanciamax= this.distancia*1000;

        

        //llamamos al servicio para obtener los coches en función de la distancia y la ciudad
        this.inventarioService.obtenerCochesPorUbicacion(latitudbuscar,longitudbuscar,distanciamax.toString()).subscribe(coches => {
          this.coches = coches;
          console.log('Coches encontrados en la ciudad de '+ ciudad);
        }
        );
      },
      (error) => {
        console.error('Error fetching address data:', error);
      }
    );

    //2º con esa 
    //hay que pasarle la distancia en metros y la ciudad

    
    

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

  


