import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  cargando = signal<boolean>(false);
  errorMsg = signal<string>('');
  exitoMsg = signal<string>('');

  registroForm = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    correoUsuario: ['', [Validators.required, Validators.email]],
    passwordUsuario: ['', [Validators.required, Validators.minLength(6)]],
    rolUsuario: ['USUARIO' as const, [Validators.required]]
  });

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMsg.set('');
    this.exitoMsg.set('');

    const payload = {
      ...this.registroForm.getRawValue(),
      flagActivo: true
    };

    this.usuarioService.create(payload).subscribe({
          next: () => {
            this.cargando.set(false);
            this.exitoMsg.set('Cuenta creada con éxito. Redirigiendo al login...');
            setTimeout(() => this.router.navigate(['/login']), 1500);
          },
          error: (err: HttpErrorResponse) => {
            this.cargando.set(false);
            this.errorMsg.set(
              err.error?.mensaje || err.error?.message || 'No se pudo completar el registro.'
            );
          }
        });
  }
}