import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-reservas-moviles',
  standalone: true,
  imports: [RouterModule,NgIf],
  templateUrl: './reservas-moviles.component.html',
  styleUrl: './reservas-moviles.component.css'
})
export class ReservasMovilesComponent {

  reservaActiva: boolean = false;

  dias: number = 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;

  targetDate!: Date;
  interval: any;
  reserva: any;
  
  ngOnInit() {
    
    this.reserva = history.state.reserva;

    const final_reserva= this.reserva.fechaFin+"T"+this.reserva.horaFin+":00";

    this.targetDate = new Date(final_reserva);
    
  }

  iniciarReserva() {
    this.reservaActiva = true;
    
    //comprobar si la fecha de inicio es anterior a la fecha actual
    if (this.checkIfBeforeToday(this.reserva.fechaInicio,this.reserva.horaInicio)) {
      this.startCountdown();
      return;
    }
    else{
      alert('Aún no puede comenzar la reserva esperese al que llegue la fecha de inicio');
    }

  }

  detenerReserva() {
    this.reservaActiva = false;
    clearInterval(this.interval);
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (!this.reservaActiva) {
        clearInterval(this.interval);
        return;
      }

      const now = new Date().getTime();
      const distance = this.targetDate.getTime() - now;

      this.dias = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.horas = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutos = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.segundos = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(this.interval);
        this.reservaActiva = false;
        this.dias = this.horas = this.minutos = this.segundos = 0;
      }
    }, 1000);
  }

  checkIfBeforeToday(fechaInicio: string,horaInicio:string): boolean {
    
    const fecha_inicio = fechaInicio + 'T' + horaInicio + ':00';

    const startDate = new Date(fecha_inicio);
    const currentDate = new Date();

    return startDate < currentDate;
  }


}
