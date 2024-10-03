import { Injectable } from '@angular/core';
import { ReservaDetalle } from '../objetos/ReservaDetalle';

@Injectable({
  providedIn: 'root'
})
export class ReservaDetalleService {

 private reservaDetalle: ReservaDetalle[]= [];

  constructor() { }

  setReservaDetalle(reserva: ReservaDetalle[]) {
    this.reservaDetalle = reserva;
  }

  getReservaDetalle(): ReservaDetalle[] {
    return this.reservaDetalle;
  }
}
