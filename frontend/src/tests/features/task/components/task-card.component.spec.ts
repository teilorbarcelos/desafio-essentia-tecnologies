import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from '../../../../app/features/task/components/task-card.component';
import { Task } from '../../../../app/features/task/task.service';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { By } from '@angular/platform-browser';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    userId: 'u1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.task = mockTask;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Visual States', () => {
    it('should show completion checkmark when task is completed', () => {
      component.task = { ...mockTask, completed: true };
      fixture.detectChanges();
      
      const checkmark = fixture.nativeElement.querySelector('.bg-emerald-50');
      expect(checkmark).toBeTruthy();
      
      const title = fixture.nativeElement.querySelector('h3');
      expect(title.classList.contains('line-through')).toBeTruthy();
    });

    it('should show "Concluir" button when task is NOT completed', () => {
      component.task = { ...mockTask, completed: false };
      fixture.detectChanges();
      
      const completeButton = fixture.debugElement.query(By.css('button[title="Concluir"]'));
      expect(completeButton).toBeTruthy();
    });

    it('should show "Sem descrição." when description is missing', () => {
      component.task = { ...mockTask, description: '' };
      fixture.detectChanges();
      
      const description = fixture.nativeElement.querySelector('p');
      expect(description.textContent.trim()).toBe('Sem descrição.');
    });
  });

  describe('Event Emissions', () => {
    it('should emit toggleComplete when complete button is clicked', () => {
      const spy = vi.spyOn(component.toggleComplete, 'emit');
      component.task = { ...mockTask, completed: false };
      fixture.detectChanges();
      
      const completeButton = fixture.debugElement.query(By.css('button[title="Concluir"]'));
      completeButton.nativeElement.click();
      
      expect(spy).toHaveBeenCalledWith(component.task);
    });

    it('should emit edit when edit button is clicked', () => {
      const spy = vi.spyOn(component.edit, 'emit');
      component.task = mockTask;
      fixture.detectChanges();
      
      const editButton = fixture.debugElement.query(By.css('button[title="Editar"]'));
      editButton.nativeElement.click();
      
      expect(spy).toHaveBeenCalledWith(component.task.id);
    });

    it('should emit delete when delete button is clicked', () => {
      const spy = vi.spyOn(component.delete, 'emit');
      component.task = mockTask;
      fixture.detectChanges();
      
      const deleteButton = fixture.debugElement.query(By.css('button[title="Excluir"]'));
      deleteButton.nativeElement.click();
      
      expect(spy).toHaveBeenCalledWith(component.task.id);
    });
  });
});
