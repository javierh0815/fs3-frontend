import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegistroComponent } from './features/auth/registro/registro';
import { RecuperarPasswordComponent } from './features/auth/recuperar-password/recuperar-password';
import { ModificarPerfilComponent } from './features/perfil/modificar-perfil/modificar-perfil';
import { CategoriasComponent } from './features/foro/categorias/categorias';
import { TemasComponent } from './features/foro/temas/temas';
import { DetalleTemaComponent } from './features/foro/detalle-tema/detalle-tema';
import { PanelAdminComponent } from './features/admin/panel-admin/panel-admin';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'categorias', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  {
    path: 'perfil',
    component: ModificarPerfilComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categorias',
    component: CategoriasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categorias/:idCategoria/temas',
    component: TemasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'temas/:idTema',
    component: DetalleTemaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: PanelAdminComponent,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: 'categorias' }
];