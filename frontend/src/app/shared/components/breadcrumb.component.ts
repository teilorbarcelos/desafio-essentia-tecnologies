import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ChevronRight, Home, LucideAngularModule } from 'lucide-angular';
import { filter, map } from 'rxjs';

interface RouteConfig {
  label: string;
  clickable?: boolean;
}

const routeMap: Record<string, RouteConfig> = {
  tasks: { label: 'Minhas Tarefas' },
  profile: { label: 'Perfil', clickable: false },
  'change-password': { label: 'Alterar Senha' },
  new: { label: 'Nova Tarefa' },
  edit: { label: 'Editar Tarefa' },
};

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <nav class="flex mb-6" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li>
          <a
            routerLink="/tasks"
            class="text-gray-400 hover:text-indigo-600 transition-colors flex items-center"
          >
            <lucide-angular [img]="HomeIcon" class="w-4 h-4"></lucide-angular>
          </a>
        </li>

        @for (item of breadcrumbs(); track item.to) {
          <li class="flex items-center">
            <lucide-angular [img]="ChevronIcon" class="w-4 h-4 text-gray-400 mx-1 shrink-0"></lucide-angular>
            @if (item.isLast || !item.clickable) {
              <span 
                class="text-sm truncate max-w-[200px]"
                [class.font-semibold]="item.isLast"
                [class.text-indigo-600]="item.isLast"
                [class.text-gray-400]="!item.isLast && !item.clickable"
              >
                {{ item.displayName }}
              </span>
            } @else {
              <a
                [routerLink]="item.to"
                class="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {{ item.displayName }}
              </a>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  private router = inject(Router);
  readonly HomeIcon = Home;
  readonly ChevronIcon = ChevronRight;

  private url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  breadcrumbs = computed(() => {
    const pathnames = this.url().split('?')[0].split('/').filter((x) => x);
    
    return pathnames
      .map((value, index) => {
        const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) || !isNaN(Number(value));
        if (isId && index > 0 && pathnames[index-1] === 'edit') return null;
        if (isId && index > 0) return null;

        const isLast = index === pathnames.length - 1 || (index === pathnames.length - 2 && (pathnames[index+1] === 'edit' || !isNaN(Number(pathnames[index+1]))));
        
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const config = routeMap[value];
        const displayName = config?.label || value.charAt(0).toUpperCase() + value.slice(1);
        const clickable = config?.clickable !== false;

        return { to, displayName, isLast, clickable };
      })
      .filter((x): x is { to: string; displayName: string; isLast: boolean; clickable: boolean } => !!x);
  });
}
