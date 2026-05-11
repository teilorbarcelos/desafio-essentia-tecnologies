import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListTodo, LucideAngularModule } from 'lucide-angular';
import { MenuService } from '../../core/services/menu.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { createListPageController } from '../../core/utils/list-page.utils';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { TaskCardComponent } from './components/task-card.component';
import { Task, TaskService } from './task.service';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    PaginationComponent,
    TaskCardComponent,
    EmptyStateComponent,
    PageHeaderComponent,
  ],
  host: {
    class: 'flex-1 flex flex-col min-h-0',
  },
  template: `
    <div class="flex-1 flex flex-col min-h-0 relative">
      <app-page-header
        title="Minhas Tarefas"
        description="Gerencie suas atividades diárias."
        buttonLabel="Nova Tarefa"
        (buttonClick)="navigateToCreate()"
      ></app-page-header>
      
      <div class="flex-1 px-4 lg:px-8 overflow-y-auto overlay-scrollbar">
        <div class="max-w-2xl mx-auto w-full py-4 space-y-8">
          <div class="relative min-h-[400px]">
            @if (isLoading()) {
              <div class="py-20 flex items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            } @else if (tasks().length === 0) {
              <app-empty-state
                title="Sua lista está vazia"
                description="Você ainda não tem tarefas cadastradas."
                [icon]="EmptyIcon"
              ></app-empty-state>
            } @else {
              <div class="space-y-4">
                @for (task of tasks(); track task.id) {
                  <app-task-card
                    [task]="task"
                    (toggleComplete)="toggleComplete($event)"
                    (edit)="navigateToEdit($event)"
                    (delete)="deleteTask($event)"
                  ></app-task-card>
                }
              </div>
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
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);

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
    const scrollContainer = document.querySelector('.overlay-scrollbar');
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
    const task = this.tasks().find(t => t.id === id);
    const confirmed = await this.confirmService.confirm({
      title: 'Excluir Tarefa',
      message: `Tem certeza que deseja excluir a tarefa "${task?.title}"? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Sim, excluir',
      variant: 'danger'
    });

    if (confirmed) {
      await this.list.deleteItem(id);
    }
  }

  async toggleComplete(task: Task) {
    const newStatus = !task.completed;
    try {
      await this.taskService.updateTask(task.id, { completed: newStatus });
      this.toastService.success(
        `Tarefa ${newStatus ? 'concluída' : 'reaberta'} com sucesso!`
      );
      this.list.loadItems();
    } catch (error) {
      this.toastService.error('Erro ao atualizar o status da tarefa.');
    }
  }
}
