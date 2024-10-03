import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReservasService } from '../servicios/reservas.service';
import { Reserva } from '../objetos/Reserva';
import moment from 'moment';
import { InventarioService } from '../servicios/inventario.service';
import { CocheHTML } from '../objetos/CocheHTML';
import { KeycloakService } from '../authentication/Keycloak.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {

  mostrarDetalles = false;
  activas= true;
  completadas= false;

  reservasanteriores: Reserva[] = [];
  reservasposteriores: Reserva[] = [];

  reservaeliminada: boolean = false;
  reservaeliminarerror: boolean = false;

  reservaDetalle!: Reserva;

  cocheDetalle!: CocheHTML;

  nombre_usuario: string = "";

  constructor(private reservasService: ReservasService,private inventarioService: InventarioService,private keycloak: KeycloakService) {
    moment.locale('es');
  }

  ngOnInit() {
    this.nombre_usuario = this.keycloak.profile?.firstName || "";
    this.mostrarActivas();

  }

  

  mostrarActivas(){
    this.activas=true;
    this.completadas=false;
    this.mostrarDetalles=false;
    
    const hoy = Date.now();                // obtenemos la fecha actual
    const hoyformat= moment(hoy).format("YYYY-MM-DD"); // 2021-02-16     
    
    this.reservasService.obtenerReservasActivas(hoyformat,this.keycloak.profile?.email|| "").subscribe(
        reservas => {
          this.reservasposteriores = reservas;
          console.log("El id de la rrserva es"+ this.reservasposteriores[0].idreserva);
        }
      );
    

  }

  mostrarCompletadas(){
    this.activas=false;
    this.completadas=true;
    this.mostrarDetalles=false;
    const hoy = Date.now();                // obtenemos la fecha actual
    const hoyformat= moment(hoy).format("YYYY-MM-DD"); // 2021-02-16     
    this.reservasService.obtenerReservasCompletadas(hoyformat,this.keycloak.profile?.email|| "").subscribe(
        reservas => {
          this.reservasanteriores = reservas;
        }
      );

  }

  mostrarDetallesActiva(reserva : Reserva){
    this.mostrarDetalles=!this.mostrarDetalles;
    this.reservaDetalle=reserva;
    //llamamos para obtener los detalles del vehiculo reservado en la reserva
    this.inventarioService.obtenerCoche(reserva.idvehiculo).subscribe(
      coche => {
        this.cocheDetalle = coche;
      }
    );
  }

  eliminarReserva(id: number){
    console.log('eliminarReserva');
    this.reservasService.eliminarReserva(id).subscribe(
      () => {
        this.reservaeliminada = true;
        this.mostrarActivas();

      }
    );
  }

}
