import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent,
    RouterModule
  ],
  template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <!-- Header with Action -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
          <p class="text-sm text-gray-500">Gerencie suas atividades diárias com facilidade.</p>
        </div>
        <app-button
          variant="primary"
          [routerLink]="['new']"
        >
          <span class="mr-2">+</span> Nova Tarefa
        </app-button>
      </div>
    </div>
  `,
})
export class TaskListPageComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
  });

  isPending = signal(false);

  isInvalid(field: string) {
    const control = this.taskForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  clearForm() {
    this.taskForm.reset();
  }

  async onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isPending.set(true);

    try {
      await this.taskService.createTask(this.taskForm.value);
      this.clearForm();
    } catch (error) {
      console.error('Erro ao cadastrar tarefa:', error);
    } finally {
      this.isPending.set(false);
    }
  }
}
