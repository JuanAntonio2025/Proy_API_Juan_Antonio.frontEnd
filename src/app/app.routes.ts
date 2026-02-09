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

export const routes: Routes = [
  { path: '', component: HomeComponent },
    // Rutas de Peticiones
  { path: 'peticiones', component: ListComponent },
  { path: 'peticiones/create', component: CreateComponent, canActivate: [authGuard] },
  { path: 'peticiones/edit/:id', component: EditComponent, canActivate: [authGuard] },
  { path: 'peticiones/:id', component: ShowComponent}, // Detalle público
    // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    // Wildcard: Cualquier ruta no encontrada va al login (o a 404)
  { path: '**', redirectTo: 'login' },
];

