import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '../authentication/Keycloak.service';
import { PermissionErrorService } from '../servicios/permission-error.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | Promise<boolean> => {

  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  const permissionErrorService= inject(PermissionErrorService);

  // Get the required roles from the route's data (define roles in route configuration)
  const requiredRoles: string[] = route.data['roles'] || [];
  
    // Check if user has the required roles
    const userRoles = keycloakService.getUserRoles();

    //the last role is the valid

    //const roletocheck = userRoles[userRoles.length-1];

    //obtenemos el rol

    var roluser='';

    for (let i=0; i<userRoles.length; i++){
      if (userRoles[i] === 'Admin' || userRoles[i] === 'Provedor'){
        var roluser= userRoles[i];
      }
    }

    //const hasRequiredRole = requiredRoles.includes(roletocheck);

    const hasRequiredRole = requiredRoles.includes(roluser);

    //const hasRequiredRole = requiredRoles.every(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      // Redirect to a 'not authorized' page or homepage
      //window.alert('You do not have the required permissions to access this page.');
      permissionErrorService.showPermissionError();
      //router.navigate(['/inicio_app']);
      return false;
    }

    return true;

    
  }

  







  
  
  
  
  


  

  
  