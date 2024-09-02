import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MessageService } from './message.service';
import { of } from 'rxjs';
import {ApiResponse} from '../objetos/Direccion';

@Injectable({
  providedIn: 'root'
})
export class GooglemapsapiService {

  
  constructor(private http: HttpClient, private messageService: MessageService) { }
  key="AIzaSyC0HaGHJvxwcVQO3BdpsaTGroQ7OPTLPyI"
  
  private googlemapsapiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key='+ this.key +'&address=';

  

  getCoordenadas(direccion: string):  Observable<ApiResponse> {
    const url = `${this.googlemapsapiUrl}${direccion}`;
    return this.http.get<ApiResponse>(url);
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
