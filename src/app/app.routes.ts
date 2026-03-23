import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ProfileComponent } from './pages/profile/profile';
import { ListComponent } from './petition/list/list';
import { CreateComponent } from './petition/create/create';
import { EditComponent } from './petition/edit/edit';
import { ShowComponent } from './petition/show/show';
import { HomeComponent } from './home/home/home';
import { MineComponent } from './petition/mine/mine';
import { SignedComponent } from './petition/signed/signed';
import { Layout } from './admin/layout/layout';
import { Home } from './admin/home/home';
import { Petitions } from './admin/petitions/petitions';
import { Users } from './admin/users/users';
import { Categories} from './admin/categories/categories';
import { adminGuard } from './auth/admin/admin-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
    // Rutas de Peticiones
  { path: 'peticiones/create', component: CreateComponent, canActivate: [authGuard] },
  { path: 'peticiones/edit/:id', component: EditComponent, canActivate: [authGuard] },
  { path: 'mis-peticiones', component: MineComponent, canActivate: [authGuard]},
  { path: 'mis-firmas', component: SignedComponent, canActivate: [authGuard]},
  { path: 'peticiones/:id', component: ShowComponent}, // Detalle público
  { path: 'peticiones', component: ListComponent },
    // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    //Admin
  {
    path: 'admin',
    component: Layout,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: Home },
      { path: 'peticiones', component: Petitions },
      { path: 'usuarios', component: Users },
      { path: 'categorias', component: Categories }
    ]
  },

    // Wildcard: Cualquier ruta no encontrada va al home
  { path: '**', redirectTo: '' },
];

