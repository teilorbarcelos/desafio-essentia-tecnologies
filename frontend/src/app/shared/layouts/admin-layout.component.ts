import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  CheckCircle,
  KeyRound,
  ListTodo,
  LogOut,
  LucideAngularModule,
  Menu,
  X
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
    <div class="h-screen w-full bg-gray-50 font-sans antialiased text-gray-900 flex overflow-hidden relative">
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

      <!-- Mobile Backdrop -->
      <div 
        *ngIf="isSidebarOpen()" 
        (click)="isSidebarOpen.set(false)"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
      ></div>
      
      <!-- Sidebar -->
      <aside 
        [class.-translate-x-full]="!isSidebarOpen()"
        class="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col shadow-xl z-40 lg:relative lg:translate-x-0 lg:w-64 lg:shadow-sm shrink-0 transition-transform duration-300 ease-in-out"
      >
        <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <div class="flex items-center space-x-2 text-indigo-600">
            <lucide-angular [img]="LogoIcon" class="w-6 h-6"></lucide-angular>
            <span class="text-xl font-bold tracking-tight text-gray-900">TechX To-do</span>
          </div>
          <button 
            (click)="isSidebarOpen.set(false)"
            class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <lucide-angular [img]="CloseIcon" class="w-5 h-5"></lucide-angular>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          @for (item of menuItems; track item.label) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-indigo-50 text-indigo-600 shadow-sm"
              (click)="isSidebarOpen.set(false)"
              class="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-50 group"
            >
              <lucide-angular [img]="item.icon" class="w-5 h-5 opacity-70 group-hover:opacity-100"></lucide-angular>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <main class="flex-1 flex flex-col min-w-0 bg-gray-50 relative overflow-hidden">
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between lg:justify-end px-4 lg:px-8 shrink-0 shadow-sm z-10">
          <!-- Mobile Menu Toggle -->
          <button 
            (click)="isSidebarOpen.set(true)"
            class="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
          >
            <lucide-angular [img]="MenuIcon" class="w-6 h-6"></lucide-angular>
          </button>

          <div class="flex items-center space-x-3 lg:space-x-6">
            <div class="flex items-center space-x-3">
              <div class="hidden sm:flex flex-col items-end">
                <span class="text-sm font-bold text-gray-900">{{ authService.user()?.name || 'Usuário' }}</span>
                <span class="text-xs text-gray-500">{{ authService.user()?.email }}</span>
              </div>
              <div class="w-9 h-9 bg-linear-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                {{ (authService.user()?.name?.[0] || authService.user()?.email?.[0] || 'U').toUpperCase() }}
              </div>
            </div>

            <div class="h-6 w-px bg-gray-200"></div>

            <div class="flex items-center space-x-1">
              <a 
                routerLink="/profile/change-password"
                class="flex items-center justify-center p-2 lg:px-3 lg:py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all cursor-pointer"
                title="Alterar Senha"
              >
                <lucide-angular [img]="PasswordIcon" class="w-4 h-4"></lucide-angular>
                <span class="hidden md:inline ml-2">Alterar Senha</span>
              </a>
              
              <button 
                (click)="logout()"
                class="flex items-center justify-center p-2 lg:px-3 lg:py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                title="Sair"
              >
                <lucide-angular [img]="LogoutIcon" class="w-4 h-4"></lucide-angular>
                <span class="hidden md:inline ml-2">Sair</span>
              </button>
            </div>
          </div>
        </header>

        <div class="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          <div class="px-4 lg:px-8 pt-6 lg:pt-8 shrink-0">
            <div class="max-w-2xl mx-auto w-full">
              <app-breadcrumb></app-breadcrumb>
            </div>
          </div>

          <div class="flex-1 flex flex-col min-h-0 relative overflow-y-auto overlay-scrollbar px-4 lg:px-8 pb-8">
            <div class="max-w-2xl mx-auto w-full flex-1 flex flex-col">
              <router-outlet></router-outlet>
            </div>
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

  isSidebarOpen = signal(false);
  readonly LogoIcon = CheckCircle;
  readonly LogoutIcon = LogOut;
  readonly PasswordIcon = KeyRound;
  readonly MenuIcon = Menu;
  readonly CloseIcon = X;

  menuItems = [
    { label: 'Minhas Tarefas', path: '/tasks', icon: ListTodo },
  ];

  logout() {
    this.authService.logout();
  }
}
