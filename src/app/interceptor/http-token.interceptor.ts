import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import { KeycloakService } from '../authentication/Keycloak.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private keycloakService: KeycloakService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // solo añadimos la cabecera a las URLs que no sean de autenticación
    const thirdPartyApiUrls=[
      "https://apiv1.geoapi.es/",
      "https://maps.googleapis.com/maps/api/geocode/json",
      
    ]

    const isThirdPartyApi = thirdPartyApiUrls.some(url => request.url.startsWith(url));

    if(!isThirdPartyApi){
      if(this.keycloakService.isTokenExpired()){
        //console.log('El token ha expirado');
        this.keycloakService.updateToken();
        
      }
      const token = this.keycloakService.keycloak.token;
      
      if (token) {
        const authReq = request.clone({
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`
          })
        });
        return next.handle(authReq);
      }
    }
    else{

    }
    return next.handle(request);
    
  }
}