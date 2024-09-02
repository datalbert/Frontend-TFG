import { Component } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from '../objetos/Usuario';
import { Usuario2 } from '../objetos/Usuario2';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { UsuariosService } from '../servicios/usuarios.service';

@Component({
  selector: 'app-crearcuenta',
  standalone: true,
  imports: [RouterModule,FormsModule,HttpClientModule],
  templateUrl: './crearcuenta.component.html',
  styleUrl: './crearcuenta.component.css'
})
export class CrearcuentaComponent {

  nombre!: string;
  apellidos!: string;
  email!: string;
  password!: string;
  direccion!: string;
  ciudad!: string;
  provincia!: string;
  codigopostal!: string;

  model2 = new Usuario(this.nombre, this.apellidos, this.email, this.password, this.direccion, this.ciudad, this.provincia, this.codigopostal);
  
  model= new Usuario2(this.nombre,this.apellidos,"678987123","12345678A",this.email,this.password);

  
  submitted = false;


  constructor(private usuariosService: UsuariosService) { }

  onSubmit() {
    this.submitted = true;
    this.usuariosService.createUsuario(this.model)
    .subscribe();
  }

}


  


  


