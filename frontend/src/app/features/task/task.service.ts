import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  getTasks(page = 1, limit = 25) {
    return firstValueFrom(this.http.get<ListResponse<Task>>('/v1/tasks', {
      params: { page: page.toString(), limit: limit.toString() }
    }));
  }

  getTaskById(id: string) {
    return firstValueFrom(this.http.get<Task>(`/v1/tasks/${id}`));
  }

  createTask(data: CreateTaskDTO) {
    return firstValueFrom(this.http.post<Task>('/v1/tasks', data));
  }

  updateTask(id: string, data: Partial<CreateTaskDTO & { completed: boolean }>) {
    return firstValueFrom(this.http.patch<Task>(`/v1/tasks/${id}`, data));
  }

  deleteTask(id: string) {
    return firstValueFrom(this.http.delete<void>(`/v1/tasks/${id}`));
  }
}
