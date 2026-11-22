import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMsg = '';
  exitoMsg = '';
  cargando = false;


  private readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/;

  registroForm = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    correoUsuario: ['', [Validators.required, Validators.email]],
    passwordUsuario: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(this.PASSWORD_PATTERN)
    ]]
  });

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMsg = '';
    this.exitoMsg = '';

    const nuevoUsuario = {
      ...this.registroForm.getRawValue(),
      rolUsuario: 'USUARIO',
      flagActivo: true
    };

    this.authService.registrar(nuevoUsuario).subscribe({
      next: () => {
        this.cargando = false;
        this.exitoMsg = 'Cuenta creada con éxito. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.mensaje || err.error?.message || 'Error al registrar el usuario. Verifica los datos.';
      }
    });
  }
}