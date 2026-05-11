import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Check, LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import { Task } from '../task.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  host: {
    class: 'block w-full',
  },
  template: `
    <div 
      class="group relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col"
      [class.opacity-60]="task.completed"
    >
      <div class="space-y-3 flex-1">
        <div class="flex items-start justify-between gap-4">
          <h3 
            class="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors"
            [class.line-through]="task.completed"
            [class.text-gray-400]="task.completed"
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
          @if (!task.completed) {
            <button 
              (click)="toggleComplete.emit(task)" 
              class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" 
              title="Concluir"
            >
              <lucide-angular [img]="CheckIcon" class="w-4 h-4"></lucide-angular>
            </button>
          }
          <button 
            (click)="edit.emit(task.id)" 
            class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" 
            title="Editar"
          >
            <lucide-angular [img]="EditIcon" class="w-4 h-4"></lucide-angular>
          </button>
          <button 
            (click)="delete.emit(task.id)" 
            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
            title="Excluir"
          >
            <lucide-angular [img]="DeleteIcon" class="w-4 h-4"></lucide-angular>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  readonly CheckIcon = Check;
  readonly EditIcon = Pencil;
  readonly DeleteIcon = Trash2;
}
