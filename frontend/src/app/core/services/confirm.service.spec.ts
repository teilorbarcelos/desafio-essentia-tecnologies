import { TestBed } from '@angular/core/testing';
import { ConfirmService } from './confirm.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ConfirmService', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open and close the modal correctly with handleConfirm', async () => {
    const promise = service.confirm({ 
      title: 'Test Title',
      message: 'Test Message',
      confirmLabel: 'OK',
      variant: 'danger'
    });
    
    expect(service.state().isOpen).toBe(true);
    expect(service.state().options.title).toBe('Test Title');
    expect(service.state().options.message).toBe('Test Message');
    expect(service.state().options.confirmLabel).toBe('OK');
    expect(service.state().options.variant).toBe('danger');
    
    service.handleConfirm();
    
    const result = await promise;
    expect(result).toBe(true);
    expect(service.state().isOpen).toBe(false);
  });

  it('should handle cancel correctly', async () => {
    const promise = service.confirm();
    service.handleCancel();
    
    const result = await promise;
    expect(result).toBe(false);
    expect(service.state().isOpen).toBe(false);
  });

  it('should use default values if options are missing', () => {
    service.confirm();
    expect(service.state().options.title).toBe('Confirmar');
    expect(service.state().options.message).toBe('Tem certeza?');
  });
});
