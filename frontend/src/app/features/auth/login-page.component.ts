import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button.component';
import { InputComponent } from '../../shared/components/input.component';
import { PasswordInputComponent } from '../../shared/components/password-input.component';
import { AuthService, User } from './auth.service';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, PasswordInputComponent, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
            TechX To-do
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            Acesse sua conta para gerenciar suas tarefas
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <app-input
              label="E-mail"
              type="email"
              formControlName="email"
              placeholder="seu@email.com"
              [error]="isInvalid('email') ? (loginForm.get('email')?.errors?.['required'] ? 'E-mail é obrigatório' : 'E-mail inválido') : null"
            ></app-input>

            <app-password-input
              label="Senha"
              formControlName="password"
              placeholder="Sua senha"
              autocomplete="current-password"
              [error]="isInvalid('password') ? 'Senha é obrigatória' : null"
            ></app-password-input>
          </div>

          @if (errorMessage()) {
            <div class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              {{ errorMessage() }}
            </div>
          }

          <div>
            <app-button
              type="submit"
              [loading]="isPending()"
              className="w-full"
            >
              Entrar
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private http: HttpClient = inject(HttpClient);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isPending = signal(false);
  errorMessage = signal<string | null>(null);

  isInvalid(field: string) {
    const control = this.loginForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isPending.set(true);
    this.errorMessage.set(null);

    try {
      const response: LoginResponse = await firstValueFrom(
        this.http.post<LoginResponse>('/v1/auth/login', this.loginForm.value)
      );
      this.authService.login(response.token, response.refreshToken, response.user);
      await this.router.navigate(['/tasks']);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0 || !error.status) {
          this.errorMessage.set('O servidor está offline. Tente novamente mais tarde.');
        } else if (error.status === 401) {
          this.errorMessage.set('E-mail ou senha incorretos.');
        } else {
          this.errorMessage.set('Ocorreu um erro ao tentar entrar. Tente novamente.');
        }
      } else {
        this.errorMessage.set('Ocorreu um erro inesperado.');
      }
    } finally {
      this.isPending.set(false);
    }
  }
}
