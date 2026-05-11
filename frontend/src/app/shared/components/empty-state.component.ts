import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm animate-in fade-in duration-500">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
        <lucide-angular [img]="icon" class="w-10 h-10"></lucide-angular>
      </div>
      <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
      <p class="text-gray-500 max-w-xs text-center mt-2">{{ description }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) icon!: any;
}
