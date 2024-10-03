import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  API_KEY = 'AIzaSyC0HaGHJvxwcVQO3BdpsaTGroQ7OPTLPyI'

  url!: string;

  constructor(private http: HttpClient) { }

  isMobile(): boolean {
    return window.innerWidth <= 768; // Define el umbral para dispositivos móviles
  }

  isDesktop(): boolean {
    return window.innerWidth > 768;
  }

  getCurrentPosition(): Promise<any> {
    this.url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${this.API_KEY}`;

    return this.http.post(this.url, {}).toPromise();




}

}




