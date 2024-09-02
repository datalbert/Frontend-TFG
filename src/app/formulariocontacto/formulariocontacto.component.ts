import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Obj } from '@popperjs/core';

@Component({
  selector: 'app-formulariocontacto',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './formulariocontacto.component.html',
  styleUrl: './formulariocontacto.component.css'
})
export class FormulariocontactoComponent {


  mensajeContacto: Object ={
    nombrecontacto: '',
    mensajecontacto: '',
    telefonocontacto: 0,
    emailcontacto: ''
  }
  

  nombrecontacto: string = '';
  mensajecontacto: string = '';
  telefonocontacto: number = 0;
  emailcontacto: string = '';

  submitForm() {

    // enviar los datos al backend 
    console.log(this.nombrecontacto);




  }

  
}
