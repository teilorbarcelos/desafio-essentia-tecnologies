import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  LucideIconProvider,
  LUCIDE_ICONS,
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
  X,
  Home,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Pencil,
  Check
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
        X,
        Home,
        ChevronRight,
        ChevronLeft,
        Trash2,
        Pencil,
        Check
      })
    },
  ]
};
