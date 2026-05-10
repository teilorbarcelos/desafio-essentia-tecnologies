import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordInputComponent, ButtonComponent],
  template: `
    <div class="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Alterar Senha</h1>
        <p class="text-gray-600 mb-8">Preencha os campos abaixo para atualizar sua senha de acesso.</p>

        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <app-password-input
              label="Senha Atual"
              formControlName="currentPassword"
              placeholder="Digite sua senha atual"
              [error]="isInvalid('currentPassword') ? 'Senha atual é obrigatória' : null"
            ></app-password-input>

            <app-password-input
              label="Nova Senha"
              formControlName="newPassword"
              placeholder="Digite a nova senha"
              [error]="isInvalid('newPassword') ? (passwordForm.get('newPassword')?.errors?.['minlength'] ? 'A senha deve ter pelo menos 6 caracteres' : 'Nova senha é obrigatória') : null"
            ></app-password-input>

            <app-password-input
              label="Confirmar Nova Senha"
              formControlName="confirmPassword"
              placeholder="Confirme a nova senha"
              [error]="passwordForm.errors?.['mismatch'] && (passwordForm.get('confirmPassword')?.dirty || passwordForm.get('confirmPassword')?.touched) ? 'As senhas não coincidem' : (isInvalid('confirmPassword') ? 'Confirmação é obrigatória' : null)"
            ></app-password-input>
          </div>

          @if (errorMessage()) {
            <div class="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              {{ errorMessage() }}
            </div>
          }

          @if (successMessage()) {
            <div class="text-emerald-600 text-sm bg-emerald-50 p-4 rounded-xl border border-emerald-100 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              {{ successMessage() }}
            </div>
          }

          <div class="flex justify-end pt-4">
            <app-button
              type="submit"
              [loading]="isPending()"
              className="w-full sm:w-auto"
            >
              Atualizar Senha
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ChangePasswordPageComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  isPending = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  passwordMatchValidator(g: FormGroup) {
    const newPass = g.get('newPassword')?.value;
    const confirmPass = g.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  isInvalid(field: string) {
    const control = this.passwordForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  async onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isPending.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      await firstValueFrom(
        this.http.post('/v1/auth/change-password', {
          currentPassword: this.passwordForm.value.currentPassword,
          newPassword: this.passwordForm.value.newPassword
        })
      );
      this.successMessage.set('Senha alterada com sucesso!');
      this.passwordForm.reset();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.errorMessage.set(error.error?.message || 'Ocorreu um erro ao alterar a senha.');
      } else {
        this.errorMessage.set('Erro inesperado.');
      }
    } finally {
      this.isPending.set(false);
    }
  }
}
