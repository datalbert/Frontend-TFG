import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf, NgFor, etc.
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { RouterModule,RouterOutlet } from '@angular/router';
import { KeycloakService } from '../authentication/Keycloak.service';


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [MatSidenavModule,MatButtonModule,MatIconModule,MatToolbarModule,MatNavList,RouterModule, RouterOutlet,CommonModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = true;

  constructor(private observer: BreakpointObserver,private readonly keycloak: KeycloakService) {}

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }

  cerrarsesion(){
    this.keycloak.logout();
  }
}