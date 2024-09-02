import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Reserva } from '../objetos/Reserva';
import { ReservaHtmlcreate } from '../objetos/ReservasHtmlcreate';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private reservasUrl = 'http://localhost:8071/tfg/reservas';

  obtenerReservasCompletadas(fecha: string) : Observable<Reserva[]> {
    const url = `${this.reservasUrl}/completadas/${fecha}`;
    return this.http.get<Reserva[]>(url).pipe(
      tap(_ => this.log('fetched reservas')),
      catchError(this.handleError<Reserva[]>('obtenerReservasAnteriores', []))
    );
  }

  obtenerReservasActivas(fecha: string) : Observable<Reserva[]> {
    const url = `${this.reservasUrl}/activas/${fecha}`;
    return this.http.get<Reserva[]>(url).pipe(
      tap(_ => this.log('fetched reservas')),
      catchError(this.handleError<Reserva[]>('obtenerReservasPosteriores', []))
    );
  }

  eliminarReserva(id : number): Observable<Reserva> {
    const url = `${this.reservasUrl}/${id}`;
    return this.http.delete<Reserva>(url).pipe(

      tap(_ => this.log(`deleted reserva id=${id}`)),
      catchError(this.handleError<Reserva>('eliminarReserva'))
    );
  }

  crearReserva(reserva: ReservaHtmlcreate):Observable<{ status: string; message: string; }> {

    const url = `${this.reservasUrl}/`;
    
    return this.http.post<{status: string, message:string}>(url,reserva).pipe( 
      map(response => response),
      catchError(this.handleError<any>('reservation'))
    );

  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
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
