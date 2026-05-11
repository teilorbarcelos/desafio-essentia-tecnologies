import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 max-w-2xl mx-auto w-full pb-4 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ title }}</h1>
        <p class="text-sm text-gray-500 mt-1 leading-relaxed">{{ description }}</p>
      </div>
      @if (buttonLabel) {
        <app-button variant="primary" size="sm" (btnClick)="buttonClick.emit()" class="w-full sm:w-auto">
          {{ buttonLabel }}
        </app-button>
      }
    </div>
  `,
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() buttonLabel?: string;
  @Output() buttonClick = new EventEmitter<void>();
}
