import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastService } from '../../../app/core/services/toast.service';
import { createListPageController, ListPageConfig } from '../../../app/core/utils/list-page.utils';
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

  it('should handle loadItems failure', async () => {
    const errorConfig: ListPageConfig<any> = {
      ...mockConfig,
      fetch: async () => { throw new Error('Load error'); }
    };

    await TestBed.runInInjectionContext(async () => {
      const controller = createListPageController(errorConfig);
      await controller.loadItems();
      
      expect(toastMock.error).toHaveBeenCalledWith('Erro ao carregar a listagem de tests.');
    });
  });

  it('should use custom loadError message', async () => {
    const customConfig: ListPageConfig<any> = {
      ...mockConfig,
      fetch: async () => { throw new Error('Load error'); },
      messages: { loadError: 'Custom load error' }
    };

    await TestBed.runInInjectionContext(async () => {
      const controller = createListPageController(customConfig);
      await controller.loadItems();
      
      expect(toastMock.error).toHaveBeenCalledWith('Custom load error');
    });
  });

  it('should return early in deleteItem if delete function is not provided', async () => {
    const noDeleteConfig: ListPageConfig<any> = {
      feature: 'test',
      baseRoute: '/test',
      fetch: async () => ({ items: [], total: 0 })
    };

    await TestBed.runInInjectionContext(async () => {
      const controller = createListPageController(noDeleteConfig);
      await controller.deleteItem('1');
      
      expect(toastMock.success).not.toHaveBeenCalled();
      expect(toastMock.error).not.toHaveBeenCalled();
    });
  });

  it('should use custom delete success and error messages', async () => {
    const customMessagesConfig: ListPageConfig<any> = {
      ...mockConfig,
      messages: {
        deleteSuccess: 'Custom success',
        deleteError: 'Custom error'
      }
    };

    await TestBed.runInInjectionContext(async () => {
      const controller = createListPageController(customMessagesConfig);
      
      // Success
      await controller.deleteItem('1');
      expect(toastMock.success).toHaveBeenCalledWith('Custom success');

      // Error
      await controller.deleteItem('error');
      expect(toastMock.error).toHaveBeenCalledWith('Custom error');
    });
  });
});
