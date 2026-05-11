import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-lg sm:px-6 animate-in slide-in-from-bottom duration-500">
      <div class="flex justify-between flex-1 sm:hidden">
        <button
          (click)="onPageChange(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Anterior
        </button>
        <button
          (click)="onPageChange(currentPage + 1)"
          [disabled]="currentPage === totalPages"
          class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Próximo
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div class="flex items-center space-x-6">
          <p class="text-sm text-gray-700">
            Mostrando
            <span class="font-medium">{{ startItem }}</span>
            até
            <span class="font-medium">{{ endItem }}</span>
            de
            <span class="font-medium">{{ totalItems }}</span>
            resultados
          </p>

          <div class="flex items-center space-x-2 border-l border-gray-200 pl-6">
            <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Linhas:</span>
            <select
              [value]="pageSize"
              (change)="handlePageSizeChange($event)"
              class="bg-white border border-gray-300 rounded-lg text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer hover:border-gray-400"
            >
              @for (size of pageSizeOptions; track size) {
                <option [value]="size" [selected]="size === pageSize">{{ size }}</option>
              }
            </select>
          </div>
        </div>
        <div>
          <nav class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              (click)="onPageChange(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span class="sr-only">Anterior</span>
              <lucide-angular [img]="ChevronLeftIcon" class="w-5 h-5"></lucide-angular>
            </button>
            
            @for (page of pages(); track page) {
              <button
                (click)="onPageChange(page)"
                [class.bg-indigo-50]="page === currentPage"
                [class.text-indigo-600]="page === currentPage"
                [class.border-indigo-500]="page === currentPage"
                [class.z-10]="page === currentPage"
                [class.cursor-pointer]="page !== currentPage"
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                {{ page }}
              </button>
            }

            <button
              (click)="onPageChange(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span class="sr-only">Próximo</span>
              <lucide-angular [img]="ChevronRightIcon" class="w-5 h-5"></lucide-angular>
            </button>
          </nav>
        </div>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() pageSizeOptions = [10, 25, 50, 100];
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  pages = computed(() => {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];
    
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  handlePageSizeChange(event: Event) {
    const size = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSizeChange.emit(size);
  }
}
