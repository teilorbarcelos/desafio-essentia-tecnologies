import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListPageComponent } from './task-list-page.component';
import { Task, TaskService } from './task.service';
import { MenuService } from '../../core/services/menu.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { ToastService } from '../../core/services/toast.service';
import { of } from 'rxjs';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '../../shared/components/pagination.component';

describe('TaskListPageComponent', () => {
  let component: TaskListPageComponent;
  let fixture: ComponentFixture<TaskListPageComponent>;
  let taskServiceMock: any;
  let confirmServiceMock: any;
  let menuServiceMock: any;

  beforeEach(async () => {
    taskServiceMock = {
      getTasks: vi.fn().mockResolvedValue({ items: [], total: 0 }),
      deleteTask: vi.fn().mockResolvedValue({}),
      updateTask: vi.fn().mockResolvedValue({})
    };
    
    confirmServiceMock = {
      confirm: vi.fn().mockResolvedValue(true)
    };

    menuServiceMock = {
      setActiveFeature: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TaskListPageComponent, PaginationComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ConfirmService, useValue: confirmServiceMock },
        { provide: MenuService, useValue: menuServiceMock },
        { provide: ToastService, useValue: { success: vi.fn(), error: vi.fn() } },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListPageComponent);
    component = fixture.componentInstance;
    // We need to wait for effect or handle initial load manually if needed
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active feature on init', () => {
    expect(menuServiceMock.setActiveFeature).toHaveBeenCalledWith('tasks');
  });

  it('should show loading state', () => {
    component.isLoading.set(true);
    fixture.detectChanges();
    const loader = fixture.nativeElement.querySelector('.animate-spin');
    expect(loader).toBeTruthy();
  });

  it('should show empty state when no tasks', () => {
    component.isLoading.set(false);
    component.tasks.set([]);
    fixture.detectChanges();
    const emptyState = fixture.nativeElement.querySelector('app-empty-state');
    expect(emptyState).toBeTruthy();
  });

  it('should call deleteTask after confirmation', async () => {
    const mockTask: Task = { 
      id: '1', 
      title: 'Test Task', 
      completed: false, 
      userId: 'u1', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    };
    component.tasks.set([mockTask]);
    
    await component.deleteTask('1');
    
    expect(confirmServiceMock.confirm).toHaveBeenCalled();
    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('1');
  });

  it('should toggle task completion', async () => {
    const mockTask: Task = { 
      id: '1', 
      title: 'Test Task', 
      completed: false, 
      userId: 'u1', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    };
    
    await component.toggleComplete(mockTask);
    
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith('1', { completed: true });
  });

  it('should handle page change', () => {
    const scrollSpy = vi.fn();
    // Mock querySelector for scroll container
    vi.spyOn(document, 'querySelector').mockReturnValue({
      scrollTo: scrollSpy
    } as any);

    component.handlePageChange(2);
    expect(component.page()).toBe(2);
    expect(scrollSpy).toHaveBeenCalled();
  });
});
