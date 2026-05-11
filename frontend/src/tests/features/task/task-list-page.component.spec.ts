import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListPageComponent } from '../../../app/features/task/task-list-page.component';
import { Task, TaskService } from '../../../app/features/task/task.service';
import { MenuService } from '../../../app/core/services/menu.service';
import { ConfirmService } from '../../../app/core/services/confirm.service';
import { ToastService } from '../../../app/core/services/toast.service';
import { of } from 'rxjs';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../../app/shared/components/pagination.component';
import { By } from '@angular/platform-browser';

describe('TaskListPageComponent', () => {
  let component: TaskListPageComponent;
  let fixture: ComponentFixture<TaskListPageComponent>;
  let taskServiceMock: any;
  let confirmServiceMock: any;
  let menuServiceMock: any;
  let routerMock: any;
  let toastServiceMock: any;

  const mockTask: Task = { 
    id: '1', 
    title: 'Test Task', 
    completed: false, 
    userId: 'u1', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  };

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

    routerMock = {
      navigate: vi.fn()
    };

    toastServiceMock = {
      success: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TaskListPageComponent, PaginationComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ConfirmService, useValue: confirmServiceMock },
        { provide: MenuService, useValue: menuServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it('should render tasks and pagination when tasks exist', () => {
    component.isLoading.set(false);
    component.tasks.set([mockTask]);
    component.totalItems.set(1);
    fixture.detectChanges();

    const taskCard = fixture.nativeElement.querySelector('app-task-card');
    const pagination = fixture.nativeElement.querySelector('app-pagination');
    
    expect(taskCard).toBeTruthy();
    expect(pagination).toBeTruthy();
  });

  it('should trigger events from task card', () => {
    component.isLoading.set(false);
    component.tasks.set([mockTask]);
    fixture.detectChanges();
    
    const taskCard = fixture.debugElement.query(By.css('app-task-card'));
    
    // Toggle
    taskCard.triggerEventHandler('toggleComplete', mockTask);
    expect(taskServiceMock.updateTask).toHaveBeenCalled();
    
    // Edit
    taskCard.triggerEventHandler('edit', '1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks/edit', '1']);
    
    // Delete
    taskCard.triggerEventHandler('delete', '1');
    expect(confirmServiceMock.confirm).toHaveBeenCalled();
  });

  it('should call deleteTask after confirmation', async () => {
    component.tasks.set([mockTask]);
    
    await component.deleteTask('1');
    
    expect(confirmServiceMock.confirm).toHaveBeenCalled();
    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('1');
  });

  it('should NOT delete task if NOT confirmed', async () => {
    confirmServiceMock.confirm.mockResolvedValue(false);
    component.tasks.set([mockTask]);
    
    await component.deleteTask('1');
    
    expect(taskServiceMock.deleteTask).not.toHaveBeenCalled();
  });

  it('should toggle task completion success (completing)', async () => {
    await component.toggleComplete(mockTask);
    
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith('1', { completed: true });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Tarefa concluída com sucesso!');
  });

  it('should toggle task completion success (reopening)', async () => {
    const completedTask = { ...mockTask, completed: true };
    await component.toggleComplete(completedTask);
    
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith('1', { completed: false });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Tarefa reaberta com sucesso!');
  });

  it('should handle toggle task completion error', async () => {
    taskServiceMock.updateTask.mockRejectedValue(new Error('Update failed'));
    
    await component.toggleComplete(mockTask);
    
    expect(toastServiceMock.error).toHaveBeenCalledWith('Erro ao atualizar o status da tarefa.');
  });

  it('should handle page change and scroll to top', () => {
    const scrollSpy = vi.fn();
    const querySpy = vi.spyOn(document, 'querySelector').mockReturnValue({
      scrollTo: scrollSpy
    } as any);

    component.handlePageChange(2);
    expect(component.page()).toBe(2);
    expect(scrollSpy).toHaveBeenCalled();
    
    querySpy.mockRestore();
  });

  it('should handle page change when scroll container is not found', () => {
    vi.spyOn(document, 'querySelector').mockReturnValue(null);

    component.handlePageChange(3);
    expect(component.page()).toBe(3);
    // Should not throw
  });

  it('should handle page size change', () => {
    component.handlePageSizeChange(50);
    expect(component.size()).toBe(50);
    expect(component.page()).toBe(1);
  });

  it('should navigate to create page', () => {
    component.navigateToCreate();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks/new']);
  });

  it('should navigate to edit page', () => {
    component.navigateToEdit('123');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks/edit', '123']);
  });
  
  it('should call taskService.getTasks on list controller fetch', async () => {
    expect(taskServiceMock.getTasks).toHaveBeenCalled();
  });
});
