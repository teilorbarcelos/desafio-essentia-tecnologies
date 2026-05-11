import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { createListPageController, ListPageConfig } from './list-page.utils';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('ListPageUtils', () => {
  let routerMock: any;
  let toastMock: any;
  let fetchSpy: any;

  const mockConfig: ListPageConfig<any> = {
    feature: 'test',
    baseRoute: '/test',
    fetch: async (params) => {
      fetchSpy(params);
      return { items: [{ id: '1' }], total: 1 };
    },
    delete: async (id) => {
      if (id === 'error') throw new Error('Delete error');
      return { success: true };
    }
  };

  beforeEach(() => {
    routerMock = { navigate: vi.fn() };
    toastMock = { success: vi.fn(), error: vi.fn() };
    fetchSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ToastService, useValue: toastMock }
      ]
    });
  });

  it('should initialize with default values', () => {
    TestBed.runInInjectionContext(() => {
      const controller = createListPageController(mockConfig);
      expect(controller.page()).toBe(1);
      expect(controller.size()).toBe(10);
      expect(controller.searchWord()).toBe('');
      expect(controller.isLoading()).toBe(false);
    });
  });

  it('should call fetch on loadItems and update signals', async () => {
    await TestBed.runInInjectionContext(async () => {
      const controller = createListPageController(mockConfig);
      await controller.loadItems();
      
      expect(fetchSpy).toHaveBeenCalledWith(expect.objectContaining({
        page: 1,
        size: 10,
        searchWord: '',
        filters: {}
      }));
      expect(controller.items()).toEqual([{ id: '1' }]);
      expect(controller.totalItems()).toBe(1);
    });
  });

  it('should handle search and reset page', () => {
    TestBed.runInInjectionContext(() => {
      const controller = createListPageController(mockConfig);
      controller.handlePageChange(5);
      expect(controller.page()).toBe(5);
      
      controller.handleSearch('query');
      expect(controller.searchWord()).toBe('query');
      expect(controller.page()).toBe(1);
    });
  });

  it('should handle page size change and reset page', () => {
    TestBed.runInInjectionContext(() => {
      const controller = createListPageController(mockConfig);
      controller.handlePageChange(3);
      
      controller.handlePageSizeChange(50);
      expect(controller.size()).toBe(50);
      expect(controller.page()).toBe(1);
    });
  });

  it('should navigate to routes correctly', () => {
    TestBed.runInInjectionContext(() => {
      const controller = createListPageController(mockConfig);
      
      controller.navigateToCreate();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/test/new']);

      controller.navigateToEdit('abc');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/test/edit', 'abc']);
    });
  });

  it('should handle deleteItem success', async () => {
    await TestBed.runInInjectionContext(async () => {
      const controller = createListPageController(mockConfig);
      await controller.deleteItem('1');
      
      // feature 'test' becomes 'Test' in the capitalized message
      expect(toastMock.success).toHaveBeenCalledWith('Test excluída com sucesso!');
    });
  });

  it('should handle deleteItem failure', async () => {
    await TestBed.runInInjectionContext(async () => {
      const controller = createListPageController(mockConfig);
      await controller.deleteItem('error');
      
      expect(toastMock.error).toHaveBeenCalledWith('Erro ao excluir o test.');
    });
  });
});
