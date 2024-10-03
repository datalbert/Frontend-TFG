import { CanActivateFn } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { KeycloakService } from '../authentication/Keycloak.service';
import { Router } from '@angular/router';


export const auth2Guard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | Observable<boolean> | Promise<boolean> => {

  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  return keycloakService.init().then(isAuthenticated => {
    if (keycloakService.keycloak.authenticated) {
      console.log('Token'+ keycloakService.keycloak.token);
      // Verifica si el token ha expirado
      if (keycloakService.isTokenExpired()) {
        return keycloakService.updateToken().then(tokenUpdated => {
          if (!tokenUpdated) {
            keycloakService.login();
            return false;
          }
          return true;
        });
      }
      return true;
    } else {
      keycloakService.login();
      return false;
    }
  });
};