import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../core/services/menu.service';
import { createFormPageController } from '../../core/utils/form-page.utils';
import { InputComponent } from '../../shared/components/input.component';
import { PageFormComponent } from '../../shared/components/page-form.component';
import { TextareaComponent } from '../../shared/components/textarea.component';
import { CreateTaskDTO, Task, TaskService } from './task.service';

@Component({
  selector: 'app-task-form-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputComponent,
    TextareaComponent,
    PageFormComponent,
  ],
  template: `
    <app-page-form
      [title]="isEditing() ? 'Editar Tarefa' : 'Nova Tarefa'"
      [description]="isEditing() ? 'Atualize as informações da sua tarefa.' : 'Crie uma nova tarefa para sua lista.'"
      [submitLabel]="isEditing() ? 'Salvar Alterações' : 'Criar Tarefa'"
      [isLoading]="isEditing() && isLoading()"
      [isSubmitting]="isPending()"
      (submit)="onSubmit()"
      (cancel)="cancel()"
    >
      <form [formGroup]="taskForm" class="space-y-6">
        <app-input
          label="Título"
          placeholder="Ex: Estudar Angular"
          formControlName="title"
          [error]="getError('title')"
          id="task-title"
        ></app-input>

        <app-textarea
          label="Descrição"
          placeholder="Descreva detalhes da tarefa..."
          formControlName="description"
          [rows]="5"
          [error]="getError('description')"
          id="task-description"
        ></app-textarea>
      </form>
    </app-page-form>
  `,
})
export class TaskFormPageComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private menuService = inject(MenuService);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
  });

  private controller = createFormPageController<Task, CreateTaskDTO>({
    feature: 'tarefa',
    baseRoute: '/tasks',
    form: this.taskForm,
    fetch: (id) => this.taskService.getTaskById(id),
    create: (data) => this.taskService.createTask(data),
    update: (id, data) => this.taskService.updateTask(id, data),
  });

  isEditing = this.controller.isEditing;
  isLoading = this.controller.isLoading;
  isPending = this.controller.isPending;

  ngOnInit() {
    this.menuService.setActiveFeature('tasks');
    this.controller.init();
  }

  ngOnDestroy() {
    this.controller.destroy();
  }

  getError(field: string) {
    return this.controller.getError(field);
  }

  onSubmit() {
    this.controller.onSubmit();
  }

  cancel() {
    this.controller.cancel();
  }
}
