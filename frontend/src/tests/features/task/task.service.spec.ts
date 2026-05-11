import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService, Task, ListResponse, CreateTaskDTO } from '../../../app/features/task/task.service';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    userId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockListResponse: ListResponse<Task> = {
    items: [mockTask],
    total: 1,
    page: 1,
    size: 25,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should fetch tasks with default parameters', async () => {
      const promise = service.getTasks();
      
      const req = httpMock.expectOne('/v1/tasks?page=1&limit=25');
      expect(req.request.method).toBe('GET');
      req.flush(mockListResponse);

      const result = await promise;
      expect(result).toEqual(mockListResponse);
    });

    it('should fetch tasks with custom parameters', async () => {
      const promise = service.getTasks(2, 10);
      
      const req = httpMock.expectOne('/v1/tasks?page=2&limit=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockListResponse);

      const result = await promise;
      expect(result).toEqual(mockListResponse);
    });
  });

  describe('getTaskById', () => {
    it('should fetch a single task by ID', async () => {
      const promise = service.getTaskById('1');
      
      const req = httpMock.expectOne('/v1/tasks/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockTask);

      const result = await promise;
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('should send a POST request to create a task', async () => {
      const dto: CreateTaskDTO = { title: 'New Task', description: 'New Desc' };
      const promise = service.createTask(dto);
      
      const req = httpMock.expectOne('/v1/tasks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush({ ...mockTask, ...dto });

      const result = await promise;
      expect(result.title).toBe(dto.title);
    });
  });

  describe('updateTask', () => {
    it('should send a PATCH request to update a task', async () => {
      const updateData = { completed: true };
      const promise = service.updateTask('1', updateData);
      
      const req = httpMock.expectOne('/v1/tasks/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateData);
      req.flush({ ...mockTask, ...updateData });

      const result = await promise;
      expect(result.completed).toBe(true);
    });
  });

  describe('deleteTask', () => {
    it('should send a DELETE request to remove a task', async () => {
      const promise = service.deleteTask('1');
      
      const req = httpMock.expectOne('/v1/tasks/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      await promise;
      // No result to check, if it didn't throw it's fine
    });
  });
});
