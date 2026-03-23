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
import { Users } from './admin/users/users';
import { Categories } from './admin/categories/categories';
import { adminGuard } from './auth/admin/admin-guard';
import { Index } from './admin/petitions/index';
import { List } from './admin/petitions/list/list';
import { Form } from './admin/petitions/form/form';
import { Details } from './admin/petitions/details/details';

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
    canActivate: [adminGuard],
    children: [
      { path: '', component: Home },

      { path: 'peticiones', component: Index },
      { path: 'peticiones/listado', component: List},
      { path: 'peticiones/crear', component: Form },
      { path: 'peticiones/editar/:id', component: Form},
      { path: 'peticiones/:id', component: Details},

      { path: 'usuarios', component: Users},
      { path: 'categorias', component: Categories }
    ]
  },

    // Wildcard: Cualquier ruta no encontrada va al home
  { path: '**', redirectTo: '' },
];

