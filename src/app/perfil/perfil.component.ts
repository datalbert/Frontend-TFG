import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../authentication/Keycloak.service';
import { UserProfile } from '../authentication/user-profile';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  userProfile?: UserProfile;

  nombre: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';

  constructor(private keycloakService : KeycloakService) { }

  ngOnInit(): void {

    this.userProfile = this.keycloakService.profile;
    this.nombre = this.userProfile?.username || '';
    this.first_name = this.userProfile?.firstName || '';
    this.last_name = this.userProfile?.lastName || '';
    this.email = this.userProfile?.email || '';



  }

  editarPerfil() {
    console.log('Editar perfil');
    this.keycloakService.accountManagement();
  }



}
