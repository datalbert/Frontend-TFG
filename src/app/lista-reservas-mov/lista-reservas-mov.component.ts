import { Component } from '@angular/core';
import { KeycloakService } from '../authentication/Keycloak.service';
import { Router, RouterModule } from '@angular/router';
import { ReservaDetalle } from '../objetos/ReservaDetalle';
import { ReservaDetalleService } from '../servicios/reserva-detalle.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-lista-reservas-mov',
  standalone: true,
  imports: [RouterModule,NgFor],
  templateUrl: './lista-reservas-mov.component.html',
  styleUrl: './lista-reservas-mov.component.css'
})
export class ListaReservasMovComponent {
userprofile: any;

  listareservas: ReservaDetalle[] = [];

  constructor(private readonly keycloak: KeycloakService,private router:Router, private reservadetalleservice: ReservaDetalleService) { }

  ngOnInit() {
    this.userprofile = this.keycloak.profile?.firstName;
    //abria que llamar a la api para obtener las reservas del usuario
   // va a devolver un array de reservas
   const reserva1 = new ReservaDetalle(
    '1234ABC',
    'Audi',
    'cliente1@example.com',
    'Alberto Ávila',
    '2024-09-30',
    '2024-10-01',
    '08:00',
    '18:00'
  );
  
  const reserva2 = new ReservaDetalle(
    '5678DEF',
    'BMW',
    'cliente2@example.com',
    'Estrella Hernandez ',
    '2024-10-05',
    '2024-10-15',
    '09:00',
    '19:00'
  );
  this.listareservas.push(reserva1);
  this.listareservas.push(reserva2);
  this.reservadetalleservice.setReservaDetalle(this.listareservas);


  

  }

  goto()
  {
    this.router.navigate(['/inicio_app_mobile/reservasmov']);
  }

}
