import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
  isClosing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  private counter = 0;

  show(message: string, type: ToastType = 'info', duration = 3000) {
    const id = ++this.counter;
    const toast: Toast = { id, type, message, duration, isClosing: false };
    
    this.toastsSignal.update(t => [...t, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  remove(id: number) {
    this.toastsSignal.update(t => t.map(toast => 
      toast.id === id ? { ...toast, isClosing: true } : toast
    ));

    setTimeout(() => {
      this.toastsSignal.update(t => t.filter(toast => toast.id !== id));
    }, 300);
  }
}
