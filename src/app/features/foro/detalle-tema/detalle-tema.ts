import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForoService } from '../../../core/services/foro';
import { AuthService } from '../../../core/services/auth';
import { Comentario, Tema } from '../../../core/models/foro.model';

@Component({
  selector: 'app-detalle-tema',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './detalle-tema.html',
  styleUrl: './detalle-tema.css'
})
export class DetalleTemaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private foroService = inject(ForoService);
  authService = inject(AuthService);

  idTema!: number;
  tema = signal<Tema | undefined>(undefined);
  comentarios = signal<Comentario[]>([]);
  cargando = signal<boolean>(true);
  enviando = signal<boolean>(false);
  errorMsg = signal<string>('');

  comentarioForm = this.fb.nonNullable.group({
    contenido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    this.idTema = Number(this.route.snapshot.paramMap.get('idTema'));
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.cargando.set(true);
    this.foroService.getTemaById(this.idTema).subscribe({
      next: (data) => this.tema.set(data)
    });

    this.foroService.getComentariosByTema(this.idTema).subscribe({
      next: (data) => {
        this.comentarios.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMsg.set('Error al cargar los comentarios del tema.');
        this.cargando.set(false);
      }
    });
  }

  publicarComentario(): void {
    if (this.comentarioForm.invalid) {
      this.comentarioForm.markAllAsTouched();
      return;
    }

    const usuario = this.authService.getUsuarioActual();
    if (!usuario || !usuario.codUsuario) {
      this.errorMsg.set('Sesión inválida para comentar.');
      return;
    }

    this.enviando.set(true);
    this.errorMsg.set('');

    const nuevoComentario: Comentario = {
      contenido: this.comentarioForm.getRawValue().contenido,
      codUsuario: usuario.codUsuario,
      idTema: this.idTema
    };

    this.foroService.crearComentario(nuevoComentario).subscribe({
      next: () => {
        this.enviando.set(false);
        this.comentarioForm.reset();
        this.cargarDetalle();
      },
      error: (err) => {
        this.enviando.set(false);
        this.errorMsg.set(err.error?.mensaje || err.error?.message || 'Error al publicar comentario.');
      }
    });
  }

  eliminarComentario(idComentario?: number): void {
    if (!idComentario || !confirm('¿Eliminar este comentario?')) return;
    this.foroService.eliminarComentario(idComentario).subscribe({
      next: () => this.cargarDetalle(),
      error: () => this.errorMsg.set('No se pudo eliminar el comentario.')
    });
  }
}