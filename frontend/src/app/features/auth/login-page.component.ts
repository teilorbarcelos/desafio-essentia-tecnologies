import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService, User } from '../../core/services/auth.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, PasswordInputComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
            TechX Todo
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
            <button
              type="submit"
              [disabled]="isPending()"
              class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              @if (isPending()) {
                <span class="flex items-center space-x-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Entrando...</span>
                </span>
              } @else {
                <span>Entrar</span>
              }
            </button>
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
      console.log('[LoginPage] Attempting login...');
      const response: LoginResponse = await firstValueFrom(
        this.http.post<LoginResponse>('/v1/auth/login', this.loginForm.value)
      );
      console.log('[LoginPage] Login successful, updating service...');
      this.authService.login(response.token, response.refreshToken, response.user);
      console.log('[LoginPage] Navigating to dashboard...');
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('[LoginPage] Login error:', error);
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
