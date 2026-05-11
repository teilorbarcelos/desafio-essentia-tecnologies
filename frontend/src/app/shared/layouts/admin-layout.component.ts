import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  CheckCircle,
  KeyRound,
  ListTodo,
  LogOut,
  LucideAngularModule
} from 'lucide-angular';
import { ConfirmService } from '../../core/services/confirm.service';
import { AuthService } from '../../features/auth/auth.service';
import { BreadcrumbComponent } from '../components/breadcrumb.component';
import { ConfirmModalComponent } from '../components/confirm-modal.component';
import { ToastContainerComponent } from '../components/toast-container.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ToastContainerComponent,
    BreadcrumbComponent,
    ConfirmModalComponent,
  ],
  template: `
    <div class="h-screen w-full bg-gray-50 font-sans antialiased text-gray-900 flex overflow-hidden">
      <app-toast-container></app-toast-container>
      
      <app-confirm-modal
        [isOpen]="confirmService.state().isOpen"
        [title]="confirmService.state().options.title || ''"
        [message]="confirmService.state().options.message || ''"
        [confirmLabel]="confirmService.state().options.confirmLabel || ''"
        [cancelLabel]="confirmService.state().options.cancelLabel || ''"
        [variant]="confirmService.state().options.variant || 'info'"
        (confirm)="confirmService.handleConfirm()"
        (cancel)="confirmService.handleCancel()"
      ></app-confirm-modal>
      
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm shrink-0 z-20">
        <div class="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <div class="flex items-center space-x-2 text-indigo-600">
            <lucide-angular [img]="LogoIcon" class="w-6 h-6"></lucide-angular>
            <span class="text-xl font-bold tracking-tight text-gray-900">TechX To-do</span>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          @for (item of menuItems; track item.label) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-indigo-50 text-indigo-600 shadow-sm"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-50 group"
            >
              <lucide-angular [img]="item.icon" class="w-5 h-5 opacity-70 group-hover:opacity-100"></lucide-angular>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div class="flex items-center space-x-2 text-indigo-600">
            <lucide-angular [img]="LogoIcon" class="w-6 h-6"></lucide-angular>
            <span class="text-sm font-semibold tracking-wide uppercase text-gray-400">TechX Platform</span>
          </div>

          <div class="flex items-center space-x-6">
            <!-- User Info -->
            <div class="flex items-center space-x-3">
              <div class="flex flex-col items-end">
                <span class="text-sm font-bold text-gray-900">{{ authService.user()?.name || 'Usuário' }}</span>
                <span class="text-xs text-gray-500">{{ authService.user()?.email }}</span>
              </div>
              <div class="w-9 h-9 bg-linear-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {{ (authService.user()?.name?.[0] || authService.user()?.email?.[0] || 'U').toUpperCase() }}
              </div>
            </div>

            <div class="h-6 w-px bg-gray-200"></div>

            <!-- Actions -->
            <div class="flex items-center space-x-1">
              <a 
                routerLink="/profile/change-password"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all cursor-pointer"
              >
                <lucide-angular [img]="PasswordIcon" class="w-4 h-4"></lucide-angular>
                <span>Alterar Senha</span>
              </a>
              
              <button 
                (click)="logout()"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              >
                <lucide-angular [img]="LogoutIcon" class="w-4 h-4"></lucide-angular>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </header>

        <div class="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          <div class="px-8 pt-8 shrink-0">
            <div class="max-w-2xl mx-auto w-full">
              <app-breadcrumb></app-breadcrumb>
            </div>
          </div>

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
  confirmService = inject(ConfirmService);
  private router = inject(Router);

  readonly LogoIcon = CheckCircle;
  readonly LogoutIcon = LogOut;
  readonly PasswordIcon = KeyRound;

  menuItems = [
    { label: 'Minhas Tarefas', path: '/tasks', icon: ListTodo },
  ];

  logout() {
    this.authService.logout();
  }
}
