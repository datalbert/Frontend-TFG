import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient,  withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { KeycloakService } from './authentication/Keycloak.service';
import { HttpTokenInterceptor } from './interceptor/http-token.interceptor';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';


export function kcFactory(kcService: KeycloakService) {
  return () => kcService.init();
}



// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCgfnB9Wjx9lmG48AJKwSrSZJzAt2bGwKw",
  authDomain: "trabajofingrado-5d450.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  //databaseURL: "https://DATABASE_NAME.firebaseio.com",
  projectId: "trabajofingrado-5d450",
  storageBucket: "gs://trabajofingrado-5d450.appspot.com",
  messagingSenderId: "221382379433",
  appId: "1:221382379433:web:2375ad6858bbe6e1a866b8",


};


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),  provideHttpClient(withInterceptorsFromDi(),), provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: HttpTokenInterceptor,
    }, provideFirebaseApp(() => initializeApp(firebaseConfig)), provideStorage(() => getStorage())],
  
};
