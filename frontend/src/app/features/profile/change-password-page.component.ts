import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PasswordInputComponent } from '../../shared/components/password-input.component';
import { PageFormComponent } from '../../shared/components/page-form.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordInputComponent, PageFormComponent],
  template: `
    <app-page-form
      title="Alterar Senha"
      description="Preencha os campos abaixo para atualizar sua senha de acesso."
      submitLabel="Atualizar Senha"
      [isSubmitting]="isLoading()"
      (submit)="onSubmit()"
      (cancel)="onCancel()"
    >
      <form [formGroup]="passwordForm" class="space-y-6">
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
          [error]="isInvalid('newPassword') ? getNewPasswordError() : null"
        ></app-password-input>

        <app-password-input
          label="Confirmar Nova Senha"
          formControlName="confirmPassword"
          placeholder="Repita a nova senha"
          [error]="isInvalid('confirmPassword') ? getConfirmPasswordError() : null"
        ></app-password-input>
      </form>
    </app-page-form>
  `,
})
export class ChangePasswordPageComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });

  isLoading = signal(false);

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  isInvalid(controlName: string) {
    const control = this.passwordForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  getNewPasswordError() {
    const errors = this.passwordForm.get('newPassword')?.errors;
    if (errors?.['required']) return 'Nova senha é obrigatória';
    if (errors?.['minlength']) return 'A senha deve ter pelo menos 6 caracteres';
    return null;
  }

  getConfirmPasswordError() {
    const control = this.passwordForm.get('confirmPassword');
    if (control?.hasError('required')) return 'Confirmação é obrigatória';
    if (this.passwordForm.hasError('mismatch')) return 'As senhas não coincidem';
    return null;
  }

  onCancel() {
    this.router.navigate(['/tasks']);
  }

  async onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    try {
      await firstValueFrom(
        this.http.post('/v1/auth/change-password', {
          currentPassword: this.passwordForm.value.currentPassword,
          newPassword: this.passwordForm.value.newPassword,
        })
      );
      
      this.toastService.success('Senha alterada com sucesso! Por favor, faça login novamente.');
      this.router.navigate(['/login']);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.toastService.error(error.error.message || 'Erro ao alterar senha. Verifique os dados.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
