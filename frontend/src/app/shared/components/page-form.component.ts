import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-page-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-8 overlay-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ title }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
          </div>
          <app-button variant="ghost" size="sm" (btnClick)="cancel.emit()" [disabled]="isSubmitting">
            {{ cancelLabel }}
          </app-button>
        </div>

        <div class="p-8 relative">
          @if (isLoading) {
            <div class="py-20 flex flex-col items-center justify-center">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <p class="mt-4 text-gray-500 text-sm font-medium">Carregando dados...</p>
            </div>
          } @else {
            <div class="space-y-6">
              <ng-content></ng-content>
              
              <div class="pt-6 border-t border-gray-50 flex items-center justify-end space-x-3">
                <app-button variant="ghost" (btnClick)="cancel.emit()" [disabled]="isSubmitting">
                  {{ cancelLabel }}
                </app-button>
                <app-button 
                  variant="primary" 
                  (btnClick)="submit.emit()" 
                  [loading]="isSubmitting"
                  [disabled]="isSubmitting"
                >
                  {{ submitLabel }}
                </app-button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PageFormComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) submitLabel!: string;
  @Input() cancelLabel = 'Cancelar';
  @Input() isLoading = false;
  @Input() isSubmitting = false;

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
