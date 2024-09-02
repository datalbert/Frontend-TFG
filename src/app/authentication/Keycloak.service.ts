import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';


@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:7070',
        realm: 'tfg',
        clientId: 'frontend',
      });
    }
    return this._keycloak;
  }

  private _profile: UserProfile | undefined;

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  //init method
  async init() {
    const authenticated = await this.keycloak.init({
      //onLoad: 'login-required',
       onLoad: 'check-sso',
      
    });

    if (authenticated) {
      this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
      // we can save the token in the user session
      this._profile.token = this.keycloak.token || '';
      
    }
  }

  isTokenExpired(): boolean {
    const tokenParsed = this.keycloak.tokenParsed;
    if (!tokenParsed) {
      return true;
    }
    const now = new Date().getTime() / 1000;
    return tokenParsed.exp ? tokenParsed.exp < now : true;
  }

  async updateToken(): Promise<boolean> {
    try {
      await this.keycloak.updateToken(30); // Actualiza el token si va a expirar en los próximos 30 segundos
      console.log('Token renovado');
      return true;
    } catch (error) {
      console.error('No se pudo renovar el token:', error);
      return false;
    }
  }




  login() {
    return this.keycloak.login();
  }

  logout() {
    // this.keycloak.accountManagement();
    return this.keycloak.logout({redirectUri: 'http://localhost:4200'});
  }
}