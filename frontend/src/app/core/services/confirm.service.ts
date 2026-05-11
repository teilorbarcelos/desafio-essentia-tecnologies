import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfirmModalVariant } from '../../shared/components/confirm-modal.component';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmModalVariant;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private confirmResult = new Subject<boolean>();
  
  state = signal<{
    isOpen: boolean;
    options: ConfirmOptions;
  }>({
    isOpen: false,
    options: {}
  });

  confirm(options: ConfirmOptions = {}): Promise<boolean> {
    this.state.set({
      isOpen: true,
      options: {
        title: options.title || 'Confirmar',
        message: options.message || 'Tem certeza?',
        confirmLabel: options.confirmLabel || 'Confirmar',
        cancelLabel: options.cancelLabel || 'Cancelar',
        variant: options.variant || 'info'
      }
    });

    return new Promise((resolve) => {
      const sub = this.confirmResult.subscribe((result) => {
        sub.unsubscribe();
        resolve(result);
      });
    });
  }

  handleConfirm() {
    this.close();
    this.confirmResult.next(true);
  }

  handleCancel() {
    this.close();
    this.confirmResult.next(false);
  }

  private close() {
    this.state.update(s => ({ ...s, isOpen: false }));
  }
}
