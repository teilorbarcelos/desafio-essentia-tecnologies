import { Routes } from '@angular/router';
import { TaskFormPageComponent } from './task-form-page.component';
import { TaskListPageComponent } from './task-list-page.component';

export const TASK_ROUTES: Routes = [
  {
    path: '',
    component: TaskListPageComponent,
  },
  {
    path: 'new',
    component: TaskFormPageComponent,
  },
  {
    path: 'edit/:id',
    component: TaskFormPageComponent,
  }
];
