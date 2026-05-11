import { TestBed } from '@angular/core/testing';
import { MenuService } from '../../../app/core/services/menu.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update active feature', () => {
    service.setActiveFeature('tasks');
    expect(service.activeFeature()).toBe('tasks');
    
    service.setActiveFeature('profile');
    expect(service.activeFeature()).toBe('profile');
  });

  it('should initialize with empty string', () => {
    expect(service.activeFeature()).toBe('');
  });
});
