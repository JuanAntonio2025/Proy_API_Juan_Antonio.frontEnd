import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from './auth/auth-interceptor';
import { API_URL } from './core/config/api.config';
import { LucideAngularModule, MapPin, LineChart, Trophy } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    { provide: API_URL, useValue: 'http://localhost:8000' },
    importProvidersFrom(
      LucideAngularModule.pick({ MapPin, LineChart, Trophy })
    ),
  ]
};
