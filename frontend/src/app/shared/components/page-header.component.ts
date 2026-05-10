import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="flex items-center justify-between shrink-0 max-w-2xl mx-auto w-full pb-2">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
      </div>
      @if (buttonLabel) {
        <app-button variant="primary" size="sm" (btnClick)="buttonClick.emit()">
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
