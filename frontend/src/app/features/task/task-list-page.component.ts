import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Check, ListTodo, LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import { MenuService } from '../../core/services/menu.service';
import { createListPageController } from '../../core/utils/list-page.utils';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Task, TaskService } from './task.service';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ButtonComponent,
    PaginationComponent,
  ],
  host: {
    class: 'flex-1 flex flex-col min-h-0',
  },
  template: `
    <div class="flex-1 flex flex-col min-h-0 relative">
          
      <!-- Header with Action -->
      <div class="flex items-center justify-between shrink-0 max-w-2xl mx-auto w-full pb-2">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
          <p class="text-sm text-gray-500 mt-1">Gerencie suas atividades diárias.</p>
        </div>
        <app-button variant="primary" size="sm" (btnClick)="navigateToCreate()">
          Nova Tarefa
        </app-button>
      </div>
      
      <!-- Scrolling Area -->
      <div class="flex-1 overflow-y-auto px-8">
        <!-- Content Container -->
        <div class="max-w-2xl mx-auto w-full py-4 space-y-8">

          <!-- Content List -->
          <div class="relative min-h-[400px]">
            @if (isLoading()) {
              <div class="py-20 flex items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            } @else if (tasks().length === 0) {
              <div class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
                  <lucide-angular [img]="EmptyIcon" class="w-10 h-10"></lucide-angular>
                </div>
                <h3 class="text-xl font-semibold text-gray-900">Sua lista está vazia</h3>
                <p class="text-gray-500 max-w-xs text-center mt-2">Você ainda não tem tarefas cadastradas.</p>
              </div>
            } @else {
              <div class="space-y-4">
                @for (task of tasks(); track task.id) {
                  <div 
                    class="group relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col"
                    [class.opacity-75]="task.completed"
                  >
                    <div class="space-y-3 flex-1">
                      <div class="flex items-start justify-between gap-4">
                        <h3 
                          class="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors"
                          [class.line-through]="task.completed"
                          [class.text-gray-500]="task.completed"
                        >
                          {{ task.title }}
                        </h3>
                        @if (task.completed) {
                          <span class="shrink-0 bg-emerald-50 text-emerald-600 p-1 rounded-full">
                            <lucide-angular [img]="CheckIcon" class="w-4 h-4"></lucide-angular>
                          </span>
                        }
                      </div>
                      <p class="text-gray-600 text-sm leading-relaxed" [class.text-gray-400]="task.completed">
                        {{ task.description || 'Sem descrição.' }}
                      </p>
                    </div>

                    <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-end shrink-0">
                       <div class="flex items-center space-x-1">
                         <button (click)="toggleComplete(task)" class="p-2 rounded-lg transition-colors cursor-pointer" [class.text-emerald-600]="task.completed" [class.hover:bg-emerald-50]="!task.completed" [class.text-gray-400]="!task.completed" title="Concluir">
                           <lucide-angular [img]="CheckIcon" class="w-4 h-4"></lucide-angular>
                         </button>
                         <button (click)="navigateToEdit(task.id)" class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Editar">
                           <lucide-angular [img]="EditIcon" class="w-4 h-4"></lucide-angular>
                         </button>
                         <button (click)="deleteTask(task.id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Excluir">
                           <lucide-angular [img]="DeleteIcon" class="w-4 h-4"></lucide-angular>
                         </button>
                       </div>
                    </div>
                  </div>
                }
              </div>
              
              <!-- Pagination at the end of the list, aligned with cards -->
              <div class="mt-4 pb-12">
                <app-pagination
                  [totalItems]="totalItems()"
                  [pageSize]="size()"
                  [currentPage]="page()"
                  (pageChange)="handlePageChange($event)"
                ></app-pagination>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TaskListPageComponent implements OnInit {
  private taskService = inject(TaskService);
  private menuService = inject(MenuService);

  readonly EditIcon = Pencil;
  readonly DeleteIcon = Trash2;
  readonly CheckIcon = Check;
  readonly EmptyIcon = ListTodo;

  private list = createListPageController<Task>({
    feature: 'tarefa',
    baseRoute: '/tasks',
    fetch: (params) => this.taskService.getTasks(params.page, params.size),
    delete: (id) => this.taskService.deleteTask(id),
  });

  tasks = this.list.items;
  totalItems = this.list.totalItems;
  isLoading = this.list.isLoading;
  page = this.list.page;
  size = this.list.size;

  ngOnInit() {
    this.menuService.setActiveFeature('tasks');
  }

  handlePageChange(page: number) {
    this.list.handlePageChange(page);
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navigateToCreate() {
    this.list.navigateToCreate();
  }

  navigateToEdit(id: string) {
    this.list.navigateToEdit(id);
  }

  async deleteTask(id: string) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await this.list.deleteItem(id);
    }
  }

  async toggleComplete(task: Task) {
    try {
      await this.taskService.updateTask(task.id, { completed: !task.completed });
      this.list.loadItems();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  }
}
