import { Injectable } from '@angular/core';
import { Usuario2 } from '../objetos/Usuario2';
import { Observable, of, throwError} from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map,tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private usuariosUrl = 'http://localhost:8085/usuario';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getUsuarios(email: string, password: string): Observable<any> {
    const url = `${this.usuariosUrl}/buscar-usuarios?email=${email}&password=${password}`;
   return this.http.get<any>(url,{observe: 'response'}) // Usamos "any" para recibir el JSON completo
    .pipe(
      tap(_ => console.log('Usuario encontrado')),
      catchError(error => {
        console.error('Ocurrió un error:', error);
        //return this.handleError<Usuario2>('getUsuarios')(error);
        return throwError(error);
      })
    );
}

  //devuelva el mensaje de confirmación de que el usuario ha sido creado
  createUsuario(usuario: Usuario2): Observable<any> {

    const urlcrearusuario= `${this.usuariosUrl}/crear-usuarios`;
    return this.http.post<any>(urlcrearusuario, usuario, this.httpOptions).pipe( 
      tap((respuesta: string) => this.log(`Usuario creado`)),
      catchError(this.handleError<Usuario2>('createUsuario'))
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
