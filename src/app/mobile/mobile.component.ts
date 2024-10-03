import { Component } from '@angular/core';
import { DeviceService } from '../servicios/device.service';
import { MatIconModule } from '@angular/material/icon';
import { KeycloakService } from '../authentication/Keycloak.service';
import { UserProfile } from '../authentication/user-profile';
import { RouterModule,Router } from '@angular/router';

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [MatIconModule,RouterModule],
  templateUrl: './mobile.component.html',
  styleUrl: './mobile.component.css'
})
export class MobileComponent {

  latitud!: number;
  longitud!: number;

  userprofile: UserProfile | undefined;

  nombre!: string;

  constructor(private deviceService: DeviceService,private readonly keycloak: KeycloakService,
    private router:Router
  ) { }

  ngOnInit() {

    this.getLocation();
    this.userprofile = this.keycloak.profile;
    

    

  }

  getLocation(){

    this.deviceService.getCurrentPosition().then((data:any) => {
      this.latitud = data.location.lat;
      this.longitud = data.location.lng
});

}

cerrarsesion(){
  this.keycloak.logout();
}


navigateTo(path: string): void {
  // Use navigate method to route without showing parent content
  this.router.navigate(['/inicio_app_mobile/'+path]);
}

}
