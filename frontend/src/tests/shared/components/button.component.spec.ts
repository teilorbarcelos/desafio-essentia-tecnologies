import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ButtonComponent } from '../../../app/shared/components/button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Variants and Sizes', () => {
    it('should apply primary variant classes by default', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain('bg-indigo-600');
    });

    it('should apply danger variant classes', () => {
      component.variant = 'danger';
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain('bg-red-600');
    });

    it('should apply small size classes', () => {
      component.size = 'sm';
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain('px-3 py-1.5');
    });

    it('should apply large size classes', () => {
      component.size = 'lg';
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain('px-6 py-3');
    });
  });

  describe('States', () => {
    it('should show loading spinner and be disabled when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const spinner = fixture.nativeElement.querySelector('svg.animate-spin');
      expect(spinner).toBeTruthy();
      
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBeTruthy();
    });

    it('should be disabled when disabled input is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBeTruthy();
    });
  });

  describe('Events', () => {
    it('should emit btnClick when clicked', () => {
      const spy = vi.spyOn(component.btnClick, 'emit');
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      
      expect(spy).toHaveBeenCalled();
    });

    it('should NOT emit btnClick when disabled', () => {
      const spy = vi.spyOn(component.btnClick, 'emit');
      component.disabled = true;
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
