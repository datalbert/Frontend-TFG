import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Coche } from '../objetos/Coche';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { CocheHTML } from '../objetos/CocheHTML';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private inventarioUrl = 'http://localhost:8071/tfg/inventario';

  imageoptions = new HttpHeaders().set('responseType', 'blob');


  


  createInventario(nuevocoche: Coche) :Observable<{ statusCode: string; statusMsg: string; }> {
    
    const urlcrearcoche= `${this.inventarioUrl}/nuevoCoche`;
    
    const formData = new FormData();
    formData.append('nuevocoche', new Blob([JSON.stringify(nuevocoche)], { type: 'application/json' }));

    //const file = new File([imagen], "filename", { type: 'image/jpeg' });
    //formData.append('fotos', imagen);

    return this.http.post<{statusCode: string, statusMsg:string}>(urlcrearcoche,formData).pipe( 
      map(response => response),
      catchError(this.handleError<any>('createInventario'))
    );
  }

  updateCoche(coche: Coche,id: number): Observable<{statusCode: string, statusMsg: string}> {
    // Assuming the URL requires the coche ID to be part of the path, adjust as necessary
    const url = `${this.inventarioUrl}/`;

    const cocheData = {
      id: id,
      marca: coche.marca,
      modelo: coche.modelo,
      matricula: coche.matricula,
      combustible: coche.combustible,
      transmision: coche.transmision,
      numasientos: coche.numasientos
      

    };
  
    // Set headers to indicate the payload is JSON
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


  
    // Use the put method with the URL, the JSON payload, and the headers
    return this.http.put<{statusCode: string, statusMsg: string}>(url, cocheData, httpOptions).pipe(
      map(response => response),
      catchError(this.handleError<any>('updateCoche'))
    );
  }

  eliminarCoche(id: number): Observable<{statusCode: string, statusMsg: string}> {
    
    const url = `${this.inventarioUrl}/eliminarCoche/${id}`;
    
    // Create HttpHeaders instance and add a header
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    return this.http.delete<{statusCode: string, statusMsg: string}>(url, { headers }).pipe(
      map(response => response),
      tap({
        next: (response) => console.log('HTTP DELETE Success:', response),
        error: (error) => console.error('HTTP DELETE Error:', error)
      }),
      catchError(this.handleError<any>('eliminarCoche'))
    );

  }

  obtenerCoche(id: number): Observable<CocheHTML> {

    const url = `${this.inventarioUrl}/${id}`;

    return this.http.get<CocheHTML>(url).pipe(
      tap(_ => this.log('Coche obtenido')),
      catchError(this.handleError<CocheHTML>('obtenerCoche'))
    );

  }

  obtenerTodosLosCoches(): Observable<CocheHTML[]> {

    const url = `${this.inventarioUrl}/obtenerTodos`;

    return this.http.get<CocheHTML[]>(url).pipe(
      tap(_ => this.log('Coches obtenidos')),
      catchError(this.handleError<CocheHTML[]>('obtenerTodosLosCoches', []))
    );

  }

  obtenerTodosLosCochesPorEmail(email: string): Observable<CocheHTML[]> {

    const url = `${this.inventarioUrl}/?email=${email}`;

    return this.http.get<CocheHTML[]>(url).pipe(
      tap(_ => this.log('Coches obtenidos')),
      catchError(this.handleError<CocheHTML[]>('obtenerTodosLosCochesPorEmail', []))
    );

  }

  obtenerDisponibles(): Observable<CocheHTML[]> {

    const url = `${this.inventarioUrl}/obtenerDisponibles`;

    return this.http.get<CocheHTML[]>(url).pipe(
      tap(_ => this.log('Coches disponibles obtenidos')),
      catchError(this.handleError<CocheHTML[]>('obtenerDisponibles', []))
    );

  }

  obtenerImagenCoche(id: number): Observable<any> {

    const url = `${this.inventarioUrl}/obtenerImagen?id=${id}`;

    return this.http.get(url, { responseType: 'blob' }).pipe(
      tap(_ => this.log('Imagen obtenida')),
      catchError(this.handleError<any>('obtenerImagenCoche'))
    );

  }

  obtenerCochesPorUbicacion(latitud:string,longitud:string,radio:string): Observable<CocheHTML[]> {

    const url = `${this.inventarioUrl}/ubicacion/${latitud}/${longitud}/${radio}`;
    return this.http.get<CocheHTML[]>(url).pipe(
      tap(_ => this.log('Coches obtenidos por ubicacion')),
      catchError(this.handleError<CocheHTML[]>('obtenerDisponibles', []))
    );

  }

  filtrarCategorias(asientos: number, combustible: string, transmision: string): Observable<CocheHTML[]> {

    

    const url = `${this.inventarioUrl}/buscarporCategoria?combustible=${combustible}&transmision=${transmision}`;

    return this.http.get<CocheHTML[]>(url).pipe(
      tap(_ => this.log('Coches disponibles obtenidos')),
      catchError(this.handleError<CocheHTML[]>('obtenerDisponibles', []))
    );

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error('Error:', error);
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`UsuariosService: ${message}`);
  }

}
