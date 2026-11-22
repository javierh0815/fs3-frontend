import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UsuarioService } from '../../../core/services/usuario';

@Component({
  selector: 'app-modificar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './modificar-perfil.html',
  styleUrl: './modificar-perfil.css'
})
export class ModificarPerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  cargando = signal<boolean>(false);
  errorMsg = signal<string>('');
  exitoMsg = signal<string>('');
  private idUsuario?: number;
  private codUsuario?: number;
  private rolActual = 'USUARIO';

  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,20}$/;

  perfilForm = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    correoUsuario: ['', [Validators.required, Validators.email]],
    passwordUsuario: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(this.passwordPattern)
      ]
    ]
  });

  get passValue(): string {
    return this.perfilForm.controls.passwordUsuario.value;
  }
  get tieneMinimo(): boolean { return this.passValue.length >= 8; }
  get tieneMaximo(): boolean { return this.passValue.length > 0 && this.passValue.length <= 20; }
  get tieneLetrasYNumeros(): boolean {
    return /[a-z]/.test(this.passValue) && /[A-Z]/.test(this.passValue) && /\d/.test(this.passValue);
  }
  get tieneEspecial(): boolean { return /[@$!%*?&.#_-]/.test(this.passValue); }

  ngOnInit(): void {
    const actual = this.authService.getUsuarioActual();
    if (!actual || !actual.idUsuario) {
      this.errorMsg.set('No se encontró la sesión del usuario.');
      return;
    }

    this.idUsuario = actual.idUsuario;
    this.codUsuario = actual.codUsuario;
    this.rolActual = actual.rolUsuario;

    this.perfilForm.patchValue({
      nombreUsuario: actual.nombreUsuario,
      correoUsuario: actual.correoUsuario
    });
  }

  onSubmit(): void {
    if (this.perfilForm.invalid || !this.idUsuario) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMsg.set('');
    this.exitoMsg.set('');

    const payload = {
      ...this.perfilForm.getRawValue(),
      rolUsuario: this.rolActual,
      flagActivo: true
    };

    this.usuarioService.update(this.idUsuario, payload).subscribe({
      next: (usuarioActualizado) => {
        this.cargando.set(false);
        this.exitoMsg.set('Perfil actualizado correctamente.');
        localStorage.setItem(
          'usuario_foro',
          JSON.stringify({
            ...usuarioActualizado,
            idUsuario: this.idUsuario,
            codUsuario: this.codUsuario
          })
        );
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMsg.set(err.error?.mensaje || 'No se pudo actualizar el perfil.');
      }
    });
  }
}