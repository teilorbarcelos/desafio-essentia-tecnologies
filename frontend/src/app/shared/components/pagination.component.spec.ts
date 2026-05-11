import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    fixture.componentRef.setInput('totalItems', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
    
    expect(component.totalPages()).toBe(5);
    
    fixture.componentRef.setInput('totalItems', 0);
    fixture.detectChanges();
    expect(component.totalPages()).toBe(1); 
  });

  it('should calculate start and end items correctly', () => {
    fixture.componentRef.setInput('totalItems', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();
    
    expect(component.startItem()).toBe(1);
    expect(component.endItem()).toBe(10);

    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();
    expect(component.startItem()).toBe(11);
    expect(component.endItem()).toBe(20);

    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalItems', 45);
    fixture.detectChanges();
    expect(component.endItem()).toBe(45);
  });

  it('should generate correct page list', () => {
    fixture.componentRef.setInput('totalItems', 100);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();
    expect(component.pages()).toEqual([1, 2, 3, 4, 5]);

    fixture.componentRef.setInput('currentPage', 5);
    fixture.detectChanges();
    expect(component.pages()).toEqual([3, 4, 5, 6, 7]);

    fixture.componentRef.setInput('currentPage', 10);
    fixture.detectChanges();
    expect(component.pages()).toEqual([6, 7, 8, 9, 10]);
  });

  it('should emit pageChange when onPageChange is called with valid page', () => {
    fixture.componentRef.setInput('totalItems', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const spy = vi.spyOn(component.pageChange, 'emit');
    
    component.onPageChange(2);
    expect(spy).toHaveBeenCalledWith(2);

    spy.mockClear();
    component.onPageChange(1); // Same as current
    expect(spy).not.toHaveBeenCalled();

    spy.mockClear();
    component.onPageChange(0); // Invalid
    expect(spy).not.toHaveBeenCalled();

    spy.mockClear();
    component.onPageChange(6); // Invalid (total is 5)
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit pageSizeChange when handlePageSizeChange is called', () => {
    const spy = vi.spyOn(component.pageSizeChange, 'emit');
    const event = { target: { value: '25' } } as unknown as Event;
    
    component.handlePageSizeChange(event);
    expect(spy).toHaveBeenCalledWith(25);
  });

  it('should call onPageChange when a page button is clicked', () => {
    fixture.componentRef.setInput('totalItems', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const spy = vi.spyOn(component, 'onPageChange');
    const buttons = fixture.nativeElement.querySelectorAll('nav button');
    // Index mapping in template:
    // 0: Previous
    // 1-5: Pages (1, 2, 3, 4, 5)
    // 6: Next
    buttons[2].click(); // Clicks on page 2 button
    expect(spy).toHaveBeenCalledWith(2);
  });
});
