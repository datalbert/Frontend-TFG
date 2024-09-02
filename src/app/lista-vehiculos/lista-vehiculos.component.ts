import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { InventarioService } from '../servicios/inventario.service';
import { Coche } from '../objetos/Coche';
import { CocheHTML } from '../objetos/CocheHTML';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';
import { Storage, ref, listAll , getDownloadURL, deleteObject} from '@angular/fire/storage';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-lista-vehiculos',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule],
  templateUrl: './lista-vehiculos.component.html',
  styleUrl: './lista-vehiculos.component.css'
})
export class ListaVehiculosComponent {

  coches: CocheHTML[] = [];


  urlImagenes: any[] = [];


  imagen:any;

  selectedCocheVer!: CocheHTML | null;
  selectedCocheEditar!: CocheHTML | null;

  constructor(private inventarioService: InventarioService, private sanitizier:DomSanitizer,private storage: Storage) { }

  ngOnInit() {
    this.inventarioService.obtenerTodosLosCoches().subscribe(
      coches => {
        this.coches = coches;
      },
      error => {
        // Handle error when obtaining all cars
        console.log("Error al obtener los coches");
        console.error('Error obtaining all cars:', error);
      }
    );
    const listRef = ref(this.storage, 'vehiculos');
    listAll(listRef).then((res) => {
      for (let item of res.items) {
        getDownloadURL(item).then((url) => {
          this.urlImagenes.push(url);
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  onSubmit(form: NgForm,id:number) {

    
    this.inventarioService.updateCoche(form.value,id).subscribe({
      next: (response) => {
        // Successfully updated the car
        console.log(`Coche has been updated. ${response.statusMsg}`);
        // Consider removing window.location.reload() to avoid reloading the entire page,
        // and instead rely on Angular's data binding to update the UI.
        window.location.reload();
      },
      error: (error) => {
        // Handle any errors here
        console.error('Error updating the coche:', error);
      }
    });
    
  }
  deleteCoche(cocheId: number,matricula: string): void {
    // Eliminar la foto de firebase
    const imagenRef = ref(this.storage, 'vehiculos/'+matricula);

    deleteObject(imagenRef).then(() => {
      // File deleted successfully
      console.log("Imagen eliminada");
      return lastValueFrom(this.inventarioService.eliminarCoche(cocheId));
      
    })
    .then((response) => {
      console.log(`Coche has been deleted. ${response.statusMsg}`);
      window.location.reload();
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.log("Error al eliminar la imagen");
      console.error('Error deleting the coche:', error);
    });

    
  }



}
