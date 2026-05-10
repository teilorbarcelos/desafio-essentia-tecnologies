import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { createFormPageController } from '../../core/utils/form-page.utils';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';
import { CreateTaskDTO, Task, TaskService } from './task.service';

@Component({
  selector: 'app-task-form-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    InputComponent, 
    TextareaComponent
  ],
  template: `
    <div class="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditing() ? 'Editar Tarefa' : 'Nova Tarefa' }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ isEditing() ? 'Atualize as informações da sua tarefa.' : 'Crie uma nova tarefa para sua lista.' }}
            </p>
          </div>
          <app-button variant="ghost" size="sm" (btnClick)="cancel()"> 
            Cancelar 
          </app-button>
        </div>

        @if (isEditing() && isLoading()) {
          <div class="py-12 text-center">
            <div class="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full" role="status" aria-label="loading">
              <span class="sr-only">Carregando...</span>
            </div>
            <p class="mt-4 text-gray-500 text-sm">Carregando dados da tarefa...</p>
          </div>
        } @else {
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <app-input
              label="Título"
              formControlName="title"
              placeholder="Ex: Reunião de Planejamento"
              [error]="getError('title')"
            ></app-input>

            <app-textarea
              label="Descrição"
              formControlName="description"
              placeholder="Descreva os detalhes da tarefa..."
              [rows]="5"
              [error]="getError('description')"
            ></app-textarea>

            @if (isEditing()) {
              <div class="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  id="completed"
                  formControlName="completed"
                  class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label for="completed" class="text-sm font-medium text-gray-700 cursor-pointer">
                  Marcar como concluída
                </label>
              </div>
            }

            <div class="pt-6 flex justify-end space-x-3">
              <app-button type="button" variant="secondary" (btnClick)="cancel()">
                Descartar
              </app-button>
              <app-button type="submit" [loading]="isPending()">
                {{ isEditing() ? 'Salvar Alterações' : 'Criar Tarefa' }}
              </app-button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class TaskFormPageComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    completed: [false],
  });

  private formCtrl = createFormPageController<Task, CreateTaskDTO>({
    feature: 'tarefa',
    baseRoute: '/tasks',
    form: this.taskForm,
    fetch: (id) => this.taskService.getTaskById(id),
    create: (data) => this.taskService.createTask(data),
    update: (id, data) => this.taskService.updateTask(id, data),
  });

  id = this.formCtrl.id;
  isEditing = this.formCtrl.isEditing;
  isLoading = this.formCtrl.isLoading;
  isPending = this.formCtrl.isPending;

  getError = this.formCtrl.getError;
  onSubmit = this.formCtrl.onSubmit;
  cancel = this.formCtrl.cancel;

  ngOnInit() {
    this.formCtrl.init();
  }

  ngOnDestroy() {
    this.formCtrl.destroy();
  }
}
