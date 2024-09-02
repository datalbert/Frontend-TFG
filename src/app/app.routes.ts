import { CanActivateFn,RouterModule,Routes } from '@angular/router';
import { CrearcuentaComponent } from './crearcuenta/crearcuenta.component';
import { InicioComponent } from './inicio/inicio.component';
import { PrincipalComponent } from './principal/principal.component';
import { FormulariocontactoComponent } from './formulariocontacto/formulariocontacto.component';
import { PerfilComponent } from './perfil/perfil.component';
import { InventarioComponent } from './inventario/inventario.component';
import { AgregarVehiculoComponent } from './agregar-vehiculo/agregar-vehiculo.component';
import { ListaVehiculosComponent } from './lista-vehiculos/lista-vehiculos.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ReservasComponent } from './reservas/reservas.component';

import { auth2Guard } from './guard/auth2.guard';
import { inject } from '@angular/core';
import { roleGuard } from './guard/role.guard';



export const routes: Routes = [

    { path: '', component:  InicioComponent },
    { 
        path: 'inicio_app', 
        component: PrincipalComponent,
        children: [
          { path: '', redirectTo: 'perfil', pathMatch: 'full'},
          { path: 'perfil', component: PerfilComponent },
          { path: 'crear-usuario', component: CrearcuentaComponent },
          { path: 'busqueda', component: BusquedaComponent},
          { path: 'reservas', component:ReservasComponent},
          { path: 'inventario', component:InventarioComponent,
            children: [
              { path: 'agregar_vehiculo', component: AgregarVehiculoComponent },
              { path: 'lista_vehiculos', component:  ListaVehiculosComponent }
          ],
          canActivate: [roleGuard]
          }

        ],
        canActivate: [auth2Guard]
      },
      { path: 'contacto', component: FormulariocontactoComponent}
];
