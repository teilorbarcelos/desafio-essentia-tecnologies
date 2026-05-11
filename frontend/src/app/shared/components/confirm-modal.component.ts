import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertCircle, Info, LucideAngularModule, TriangleAlert } from 'lucide-angular';
import { ButtonComponent } from './button.component';

export type ConfirmModalVariant = 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <div 
      *ngIf="isOpen"
      class="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div 
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        (click)="cancel.emit()"
      ></div>

      <div 
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300"
      >
        <div class="p-6">
          <div class="flex items-start space-x-4">
            <div 
              [ngClass]="{
                'bg-red-50 text-red-600': variant === 'danger',
                'bg-amber-50 text-amber-600': variant === 'warning',
                'bg-blue-50 text-blue-600': variant === 'info'
              }"
              class="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            >
              <lucide-angular [img]="getIcon()" class="w-6 h-6"></lucide-angular>
            </div>

            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 tracking-tight">
                {{ title }}
              </h3>
              <p class="mt-2 text-gray-500 leading-relaxed">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
          <app-button 
            variant="ghost" 
            (btnClick)="cancel.emit()"
          >
            {{ cancelLabel }}
          </app-button>
          <app-button 
            [variant]="variant === 'danger' ? 'primary' : 'primary'"
            [class.bg-red-600]="variant === 'danger'"
            [class.hover:bg-red-700]="variant === 'danger'"
            (btnClick)="confirm.emit()"
          >
            {{ confirmLabel }}
          </app-button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar Ação';
  @Input() message = 'Você tem certeza que deseja realizar esta ação?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() variant: ConfirmModalVariant = 'info';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  getIcon() {
    switch (this.variant) {
      case 'danger': return TriangleAlert;
      case 'warning': return AlertCircle;
      default: return Info;
    }
  }
}
