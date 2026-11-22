import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css'
})
export class RecuperarPasswordComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  cargando = signal<boolean>(false);
  errorMsg = signal<string>('');
  exitoMsg = signal<string>('');

  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,20}$/;

  recuperarForm = this.fb.nonNullable.group({
    correoUsuario: ['', [Validators.required, Validators.email]],
    nuevaPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(this.passwordPattern)
      ]
    ],
    confirmarPassword: ['', [Validators.required]]
  });

  get passValue(): string {
    return this.recuperarForm.controls.nuevaPassword.value;
  }
  get tieneMinimo(): boolean { return this.passValue.length >= 8; }
  get tieneMaximo(): boolean { return this.passValue.length > 0 && this.passValue.length <= 20; }
  get tieneLetrasYNumeros(): boolean {
    return /[a-z]/.test(this.passValue) && /[A-Z]/.test(this.passValue) && /\d/.test(this.passValue);
  }
  get tieneEspecial(): boolean { return /[@$!%*?&.#_-]/.test(this.passValue); }

  onSubmit(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    const { correoUsuario, nuevaPassword, confirmarPassword } = this.recuperarForm.getRawValue();

    if (nuevaPassword !== confirmarPassword) {
      this.errorMsg.set('Las contraseñas no coinciden.');
      return;
    }

    this.cargando.set(true);
    this.errorMsg.set('');
    this.exitoMsg.set('');

    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(
          (u) => u.correoUsuario.toLowerCase() === correoUsuario.trim().toLowerCase()
        );

        if (!usuario || !usuario.idUsuario) {
          this.cargando.set(false);
          this.errorMsg.set('No existe una cuenta registrada con ese correo electrónico.');
          return;
        }

        const payload = {
          ...usuario,
          passwordUsuario: nuevaPassword
        };

        this.usuarioService.update(usuario.idUsuario, payload).subscribe({
          next: () => {
            this.cargando.set(false);
            this.exitoMsg.set('Contraseña actualizada correctamente. Redirigiendo al login...');
            setTimeout(() => this.router.navigate(['/login']), 1500);
          },
          error: (err) => {
            this.cargando.set(false);
            this.errorMsg.set(err.error?.mensaje || 'No se pudo actualizar la contraseña.');
          }
        });
      },
      error: () => {
        this.cargando.set(false);
        this.errorMsg.set('Error al conectar con el servicio de usuarios.');
      }
    });
  }
}