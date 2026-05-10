import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  CheckCircle,
  ListTodo,
  LogOut,
  LucideAngularModule,
  User as UserIcon,
} from 'lucide-angular';
import { MenuService } from '../../../core/services/menu.service';
import { AuthService } from '../../../features/auth/auth.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ToastContainerComponent } from '../../components/toast-container/toast-container.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ButtonComponent,
    ToastContainerComponent,
    BreadcrumbComponent,
  ],
  template: `
    <div class="h-screen w-full bg-gray-50 font-sans antialiased text-gray-900 flex overflow-hidden">
      <app-toast-container></app-toast-container>
      
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm shrink-0 z-20">
        <div class="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <div class="flex items-center space-x-2 text-indigo-600">
            <lucide-angular [img]="LogoIcon" class="w-6 h-6"></lucide-angular>
            <span class="text-xl font-bold tracking-tight text-gray-900">TechX To-do</span>
          </div>
        </div>
        
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold"
              class="flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 group cursor-pointer"
            >
              <lucide-angular [img]="item.icon" class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"></lucide-angular>
              {{ item.name }}
            </a>
          }
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
        <!-- Top Bar -->
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div class="flex items-center space-x-2 text-indigo-600">
            <lucide-angular [img]="LogoIcon" class="w-6 h-6"></lucide-angular>
            <span class="text-xl font-bold tracking-tight text-gray-900">TechX To-do</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <app-button
              variant="ghost"
              size="sm"
              (btnClick)="goToProfile()"
              [className]="'hover:text-indigo-600 hover:bg-indigo-50 ' + (menuService.activeFeature() === 'profile' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-gray-500')"
              title="Meu Perfil"
            >
              <lucide-angular [img]="UserIcon" class="w-5 h-5 mr-2"></lucide-angular>
              <span class="hidden sm:inline">Perfil</span>
            </app-button>

            <app-button
              variant="ghost"
              size="sm"
              (btnClick)="handleLogout()"
              title="Sair"
            >
              <lucide-angular [img]="LogOutIcon" class="w-5 h-5 mr-2"></lucide-angular>
              <span class="hidden sm:inline">Sair</span>
            </app-button>
          </div>
        </header>

        <!-- Page Viewport -->
        <div class="flex-1 flex flex-col min-h-0 relative">
          <!-- Fixed Breadcrumb area - Matching Page Width -->
          <div class="px-8 pt-8 shrink-0">
            <div class="max-w-2xl mx-auto w-full">
              <app-breadcrumb></app-breadcrumb>
            </div>
          </div>

          <!-- Dynamic Content -->
          <div class="flex-1 flex flex-col min-h-0 relative">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  menuService = inject(MenuService);
  private router = inject(Router);

  readonly LogOutIcon = LogOut;
  readonly LogoIcon = CheckCircle;
  readonly UserIcon = UserIcon;

  navItems = [
    { name: 'Minhas Tarefas', path: '/tasks', icon: ListTodo },
  ];

  goToProfile() {
    this.router.navigate(['/profile/change-password']);
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
