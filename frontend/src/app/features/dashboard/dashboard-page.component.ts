import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Blank for now -->
    <div class="flex items-center justify-center h-full">
      <p class="text-gray-400 font-medium italic">Selecione uma opção no menu lateral...</p>
    </div>
  `,
})
export class DashboardPageComponent {}
