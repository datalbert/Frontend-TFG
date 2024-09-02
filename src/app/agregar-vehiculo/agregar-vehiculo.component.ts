import { Component } from '@angular/core';
import { Coche} from '../objetos/Coche';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../servicios/inventario.service';
import { NgFor, NgIf } from '@angular/common';
import { GeoApiService } from '../servicios/geo-api.service';
import { GooglemapsapiService } from '../servicios/googlemapsapi.service';
import { ApiResponse } from '../objetos/Direccion';
import { Storage ,ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import { lastValueFrom } from 'rxjs';




@Component({
  selector: 'app-agregar-vehiculo',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor],
  templateUrl: './agregar-vehiculo.component.html',
  styleUrl: './agregar-vehiculo.component.css'
})
export class AgregarVehiculoComponent {

  marca!: string;
  modelo!: string;
  matricula!: string;
  fotos!: File;
  combustible!: string;
  transmision!: string;
  numasientos!: string;
  comunidad!: string;
  provincia!: string;
  ciudad!: string;

  longitud!: string;
  latitud!: string;


  registroExitoso: boolean = false; // Inicialmente, no sabemos si el registro fue exitoso
  errorRegistro: boolean = false; // Inicialmente, no sabemos si hay un error

  
  ComunidadesAutom: any[] = [];
  Provincias: any[] = [];
  Municipios: any[] = [];

  addressData: ApiResponse | undefined;


  

  


  nuevocoche=new Coche(this.marca, this.modelo, this.matricula,"" ,this.combustible, this.transmision, this.numasientos,this.comunidad,this.provincia,this.ciudad,"","");

  constructor(private inventarioService: InventarioService, private geoapiservice: GeoApiService,private googlemapsapi: GooglemapsapiService,private storage: Storage) { 

      
    }
  
    ngOnInit() {
      this.geoapiservice.comunidades({}).subscribe(
        response => {
          this.ComunidadesAutom = response.data;
          
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
  
  onComunidadChange(event: any) {
    const selectedcomunidad=event.target.value;
    this.geoapiservice.provincias({CCOM: selectedcomunidad}).subscribe(
      response => {
        this.Provincias = response.data;
      },
      error => {
        console.error('Error:', error);
      }
    );

  }

  onProvinciaChange(event: any) {

    const selectedprovincia=event.target.value;
    this.geoapiservice.municipios({CPRO: selectedprovincia}).subscribe(
      response => {
        this.Municipios = response.data;
      },
      error => {
        console.error('Error:', error);
      }
    );

  }

  onMunicipioChange(event: any) {

    const selectedmunicipio=event.target.value;

    this.googlemapsapi.getCoordenadas(this.nuevocoche.ciudad).subscribe(
      (data: ApiResponse) => {
        this.addressData = data;
        this.latitud = this.addressData.results[0].geometry.location.lat.toString();
        this.longitud = this.addressData.results[0].geometry.location.lng.toString();
        console.log('La l,ongitud es :', this.longitud + ' y la latitud es: ' + this.latitud);
        this.nuevocoche.setLatitud(this.latitud);
        this.nuevocoche.setLongitud(this.longitud);
      },
      (error) => {
        console.error('Error fetching address data:', error);
      }
    );
    

  }

  
 

  onSubmit() {

    
      //Guardamos la imagen en el storage
      
    const imagenref = ref(this.storage, `vehiculos/${this.nuevocoche.matricula}`);

    uploadBytes(imagenref, this.fotos)
      .then((snapshot) => {
        console.log('Uploaded a blob or file!');
        
        // obtenemos la URL de la imagen subida
        return getDownloadURL(imagenref);
      })
      .then((url) => {
        // Asignar la URL a la propiedad urlfotos del objeto nuevocoche
        this.nuevocoche.urlfotos = url;
        console.log('Download URL:', url);
        
        // Aquí puedes proceder a guardar el objeto nuevocoche en tu base de datos, si es necesario
         // Convert Observable to Promise using lastValueFrom
        return lastValueFrom(this.inventarioService.createInventario(this.nuevocoche));
      })
      .then((response) => {
        console.log(`Coche registrado. ${response.statusMsg}`);
        this.registroExitoso = true;
        this.errorRegistro = false;
      })
      .catch((error) => {
        console.error('Error during the process:', error);
        this.errorRegistro = true;
        this.registroExitoso = false;
      });
  }

  

  onFileSelected(event:any){
    this.fotos = <File>event.target.files[0];
  }

  
}
