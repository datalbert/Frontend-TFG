import { CommonModule } from '@angular/common';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../servicios/usuarios.service';
import { Usuario2 } from '../objetos/Usuario2';
import { ChangeDetectorRef } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { DeviceService } from '../servicios/device.service';




@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule,FormsModule,HttpClientModule,CommonModule],
  //templateUrl: './inicio.component.html',
  templateUrl: './prueba.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  
  email: string = '';
  password: string = '';
  usuarios!: Usuario2;
  errorMessage: string | null = null;


  constructor(private usuariosService: UsuariosService,private router:Router,private readonly keycloak: KeycloakService, private deviceService: DeviceService) { }


  onSubmit() {
    this.usuariosService.getUsuarios(this.email, this.password)
      .subscribe(
        response => {
          this.usuarios = response.usuario;
          this.router.navigate(['/inicio_app']); // Fix: Pass a string instead of an array
        },
        error => {
          console.error('Ocurrió un error:', error);
          this.errorMessage = 'El usuario o la contraseña son incorrectos.';
        }
      );
  }

  redirectToLoginPage() {
    this.keycloak.login();
  }

  gotoinicio(){
    if (this.deviceService.isMobile()) {
      this.router.navigate(['/inicio_app_mobile']);  // Redirige a la vista móvil
    } else {
      this.router.navigate(['/inicio_app']);  // Redirige a la vista escritorio
    }
  }
}