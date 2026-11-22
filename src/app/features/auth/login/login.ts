import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  cargando = signal<boolean>(false);
  errorMsg = signal<string>('');

  loginForm = this.fb.nonNullable.group({
    correoUsuario: ['', [Validators.required, Validators.email]],
    passwordUsuario: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMsg.set('');

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/categorias']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMsg.set(
          err.error?.mensaje || err.error?.message || 'Credenciales inválidas o error de conexión.'
        );
      }
    });
  }
}