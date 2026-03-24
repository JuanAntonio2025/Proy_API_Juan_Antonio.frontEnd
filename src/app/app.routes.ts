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
import { UsersIndex } from './admin/users/index';
import { UsersList } from './admin/users/list/list';
import { UsersForm } from './admin/users/form/form';
import { CategoriesIndex } from './admin/categories/index';
import { CategoriesForm } from './admin/categories/form/form';
import { CategoriesList } from './admin/categories/list/list';
import { adminGuard } from './auth/admin/admin-guard';
import { PetitionsIndex } from './admin/petitions/index';
import { PetitionsList } from './admin/petitions/list/list';
import { PetitionsForm } from './admin/petitions/form/form';
import { PetitionsDetails } from './admin/petitions/details/details';

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

      { path: 'peticiones', component: PetitionsIndex },
      { path: 'peticiones/listado', component: PetitionsList},
      { path: 'peticiones/crear', component: PetitionsForm },
      { path: 'peticiones/editar/:id', component: PetitionsForm},
      { path: 'peticiones/:id', component: PetitionsDetails},

      { path: 'usuarios', component: UsersIndex },
      { path: 'usuarios/listado', component: UsersList },
      { path: 'usuarios/crear', component: UsersForm },
      { path: 'usuarios/editar/:id', component: UsersForm },

      { path: 'categorias', component: CategoriesIndex },
      { path: 'categorias/listado', component: CategoriesList },
      { path: 'categorias/crear', component: CategoriesForm },
      { path: 'categorias/editar/:id', component: CategoriesForm },
    ]
  },

    // Wildcard: Cualquier ruta no encontrada va al home
  { path: '**', redirectTo: '' },
];

