import { effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export interface ListResponse<T> {
  items: T[];
  total: number;
}

export interface FetchParams {
  page: number;
  size: number;
  searchWord: string;
  filters: Record<string, unknown>;
}

export interface ListPageConfig<T> {
  feature: string;
  baseRoute: string;
  fetch: (params: FetchParams) => Promise<ListResponse<T>>;
  delete?: (id: string) => Promise<unknown>;
  messages?: {
    deleteSuccess?: string;
    deleteError?: string;
    loadError?: string;
  };
}

export function createListPageController<T>(config: ListPageConfig<T>) {
  const router = inject(Router);
  const toastService = inject(ToastService);

  const items = signal<T[]>([]);
  const totalItems = signal(0);
  const isLoading = signal(false);

  const page = signal(1);
  const size = signal(10);
  const searchWord = signal('');
  const filters = signal<Record<string, unknown>>({});

  async function loadItems() {
    isLoading.set(true);
    try {
      const res = await config.fetch({
        page: page(),
        size: size(),
        searchWord: searchWord(),
        filters: filters(),
      });
      items.set(res.items);
      totalItems.set(res.total);
    } catch (error) {
      toastService.error(
        config.messages?.loadError || `Erro ao carregar a listagem de ${config.feature}s.`,
      );
    } finally {
      isLoading.set(false);
    }
  }

  effect(() => {
    loadItems();
  });

  function handleSearch(word: string) {
    searchWord.set(word);
    page.set(1);
  }

  function handlePageChange(p: number) {
    page.set(p);
  }

  function handlePageSizeChange(s: number) {
    size.set(s);
    page.set(1);
  }

  function navigateToCreate() {
    router.navigate([`${config.baseRoute}/new`]);
  }

  function navigateToEdit(id: string) {
    router.navigate([`${config.baseRoute}/edit`, id]);
  }

  async function deleteItem(id: string) {
    if (!config.delete) return;
    try {
      await config.delete(id);
      toastService.success(
        config.messages?.deleteSuccess ||
          `${config.feature.charAt(0).toUpperCase() + config.feature.slice(1)} excluída com sucesso!`,
      );
      loadItems();
    } catch (error) {
      toastService.error(config.messages?.deleteError || `Erro ao excluir o ${config.feature}.`);
    }
  }

  return {
    items,
    totalItems,
    isLoading,
    page,
    size,
    searchWord,
    filters,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    navigateToCreate,
    navigateToEdit,
    deleteItem,
    loadItems,
  };
}
