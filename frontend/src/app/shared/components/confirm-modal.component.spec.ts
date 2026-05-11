import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';
import { By } from '@angular/platform-browser';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(modal).toBeFalsy();
  });

  it('should show when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(modal).toBeTruthy();
  });

  it('should emit confirm when confirm button is clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const spy = vi.spyOn(component.confirm, 'emit');
    
    // Find confirm button. It's the second app-button.
    const buttons = fixture.debugElement.queryAll(By.css('app-button'));
    buttons[1].triggerEventHandler('btnClick', null);
    
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancel when cancel button is clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const spy = vi.spyOn(component.cancel, 'emit');
    
    const buttons = fixture.debugElement.queryAll(By.css('app-button'));
    buttons[0].triggerEventHandler('btnClick', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancel when backdrop is clicked', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const spy = vi.spyOn(component.cancel, 'emit');
    
    const backdrop = fixture.debugElement.query(By.css('.bg-gray-900\\/60'));
    backdrop.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should display correct title and message', () => {
    component.isOpen = true;
    component.title = 'Custom Title';
    component.message = 'Custom Message';
    fixture.detectChanges();
    
    const titleEl = fixture.debugElement.query(By.css('h3')).nativeElement;
    const messageEl = fixture.debugElement.query(By.css('p')).nativeElement;
    
    expect(titleEl.textContent).toContain('Custom Title');
    expect(messageEl.textContent).toContain('Custom Message');
  });

  it('should apply correct classes based on variant', () => {
    component.isOpen = true;
    component.variant = 'danger';
    fixture.detectChanges();
    
    const iconContainer = fixture.debugElement.query(By.css('.shrink-0'));
    expect(iconContainer.nativeElement.classList.contains('bg-red-50')).toBeTruthy();
    expect(iconContainer.nativeElement.classList.contains('text-red-600')).toBeTruthy();
  });
});
