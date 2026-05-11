import { TestBed } from '@angular/core/testing';
import { ToastService, Toast } from '../../../app/core/services/toast.service';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success toast and remove after duration', () => {
    service.success('Success message', 1000);
    
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Success message');
    expect(service.toasts()[0].type).toBe('success');
    
    vi.advanceTimersByTime(1000); // Wait for duration
    expect(service.toasts()[0].isClosing).toBe(true);
    
    vi.advanceTimersByTime(300); // Wait for animation
    expect(service.toasts().length).toBe(0);
  });

  it('should support other toast types', () => {
    service.error('Error');
    service.info('Info');
    service.warning('Warning');
    expect(service.toasts().length).toBe(3);
    expect(service.toasts()[0].type).toBe('error');
    expect(service.toasts()[1].type).toBe('info');
    expect(service.toasts()[2].type).toBe('warning');
  });

  it('should remove manually', () => {
    service.show('Manual', 'info', 0);
    expect(service.toasts().length).toBe(1);
    const id = service.toasts()[0].id;
    
    service.remove(id);
    expect(service.toasts()[0].isClosing).toBe(true);
    
    vi.advanceTimersByTime(300);
    expect(service.toasts().length).toBe(0);
  });

  it('should only mark the target toast as closing when multiple toasts exist', () => {
    service.show('Toast 1', 'info', 0);
    service.show('Toast 2', 'info', 0);
    const id1 = service.toasts()[0].id;
    const id2 = service.toasts()[1].id;
    
    service.remove(id1);
    
    expect(service.toasts().find((t: Toast) => t.id === id1)?.isClosing).toBe(true);
    expect(service.toasts().find((t: Toast) => t.id === id2)?.isClosing).toBe(false);
  });

  it('should not auto-remove if duration is 0', () => {
    service.show('Permanent', 'info', 0);
    vi.advanceTimersByTime(10000);
    expect(service.toasts().length).toBe(1);
  });
});
