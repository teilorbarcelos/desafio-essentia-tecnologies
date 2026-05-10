import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  LogOut,
  ListTodo,
  CheckCircle,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
  ],
  template: `
    <div class="flex h-screen w-full bg-gray-50 font-sans antialiased text-gray-900">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto shadow-sm">
        <div class="h-16 flex items-center px-6 border-b border-gray-200 shrink-0 lg:hidden">
          <!-- Mobile Brand (optional, keeping it simple) -->
          <div class="flex items-center space-x-2 text-indigo-600">
            <lucide-angular [img]="LogoIcon" class="w-6 h-6"></lucide-angular>
            <span class="text-xl font-bold tracking-tight text-gray-900">TechX Todo</span>
          </div>
        </div>
        
        <nav class="flex-1 p-4 space-y-1">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 group"
            >
              <lucide-angular [img]="item.icon" class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200"></lucide-angular>
              {{ item.name }}
            </a>
          }
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Bar -->
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <!-- Brand on the left of Top Bar -->
          <div class="flex items-center space-x-2 text-indigo-600">
            <lucide-angular [img]="LogoIcon" class="w-6 h-6"></lucide-angular>
            <span class="text-xl font-bold tracking-tight text-gray-900">TechX Todo</span>
          </div>
          
          <div class="flex items-center">
            <button
              (click)="handleLogout()"
              class="flex items-center space-x-2 px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
              title="Sair"
            >
              <lucide-angular [img]="LogOutIcon" class="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200"></lucide-angular>
              <span class="text-sm font-medium">Sair</span>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 flex flex-col min-h-0 overflow-y-auto p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  readonly LogOutIcon = LogOut;
  readonly LogoIcon = CheckCircle;

  navItems = [
    { name: 'Minhas Tarefas', path: '/dashboard', icon: ListTodo },
  ];

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
