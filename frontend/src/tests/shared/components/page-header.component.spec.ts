import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PageHeaderComponent } from '../../../app/shared/components/page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.title = 'Title';
    component.description = 'Desc';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display title and description', () => {
    component.title = 'My Page';
    component.description = 'Page Description';
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('h1')).nativeElement;
    const descEl = fixture.debugElement.query(By.css('p')).nativeElement;

    expect(titleEl.textContent).toBe('My Page');
    expect(descEl.textContent).toBe('Page Description');
  });

  it('should show action button when buttonLabel is provided', () => {
    component.title = 'Title';
    component.description = 'Desc';
    component.buttonLabel = 'Action';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent).toContain('Action');
  });

  it('should NOT show action button when buttonLabel is NOT provided', () => {
    component.title = 'Title';
    component.description = 'Desc';
    component.buttonLabel = undefined;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button).toBeFalsy();
  });

  it('should emit buttonClick when action button is clicked', () => {
    component.title = 'Title';
    component.description = 'Desc';
    component.buttonLabel = 'Action';
    fixture.detectChanges();

    const spy = vi.spyOn(component.buttonClick, 'emit');
    const button = fixture.debugElement.query(By.css('app-button'));
    button.triggerEventHandler('btnClick', null);

    expect(spy).toHaveBeenCalled();
  });
});
