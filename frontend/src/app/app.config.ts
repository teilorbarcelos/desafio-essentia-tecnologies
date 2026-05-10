import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  CheckCircle,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Info,
  LUCIDE_ICONS,
  LayoutDashboard,
  ListTodo,
  LogOut,
  LucideIconProvider,
  TriangleAlert,
  User,
  X
} from 'lucide-angular';

import { routes } from './app.routes';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './features/auth/auth.service';

function initializeApp(authService: AuthService) {
  return () => authService.checkAuth();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor, authInterceptor])),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    },
    {
      provide: LUCIDE_ICONS,
      useValue: new LucideIconProvider({ 
        LayoutDashboard, 
        LogOut, 
        User, 
        CheckCircle,
        Eye,
        EyeOff,
        ListTodo,
        CircleAlert,
        TriangleAlert,
        CircleCheck,
        Info,
        X
      })
    },
  ]
};
