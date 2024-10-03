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
import { MobileComponent } from './mobile/mobile.component';
import { ReservasMovilesComponent } from './reservas-moviles/reservas-moviles.component';
import { ListaReservasMovComponent } from './lista-reservas-mov/lista-reservas-mov.component';



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
            data: { roles: ['Admin', 'Provedor'] },
            children: [
              { path: 'agregar_vehiculo', component: AgregarVehiculoComponent },
              { path: 'lista_vehiculos', component:  ListaVehiculosComponent  }
          ],
          canActivate: [roleGuard]
          }

        ],
        canActivate: [auth2Guard]
      },
      { 
        path: 'inicio_app_mobile', 
        component: MobileComponent,
        children: [
            { path: '', component: ListaReservasMovComponent},
            {path: 'reservasmov', component: ReservasMovilesComponent}
        ],
        canActivate: [auth2Guard]
      },
      { path: 'contacto', component: FormulariocontactoComponent}
];
