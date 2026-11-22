import { Component, OnInit, inject } from '@angular/core';
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
  tema?: Tema;
  comentarios: Comentario[] = [];
  cargando = true;
  enviando = false;
  errorMsg = '';

  comentarioForm = this.fb.nonNullable.group({
    contenido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    this.idTema = Number(this.route.snapshot.paramMap.get('idTema'));
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.cargando = true;
    this.foroService.getTemaById(this.idTema).subscribe({
      next: (data) => (this.tema = data)
    });

    this.foroService.getComentariosByTema(this.idTema).subscribe({
      next: (data) => {
        this.comentarios = data;
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar los comentarios del tema.';
        this.cargando = false;
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
      this.errorMsg = 'Sesión inválida para comentar.';
      return;
    }

    this.enviando = true;
    this.errorMsg = '';

    const nuevoComentario: Comentario = {
      contenido: this.comentarioForm.getRawValue().contenido,
      codUsuario: usuario.codUsuario,
      idTema: this.idTema
    };

    this.foroService.crearComentario(nuevoComentario).subscribe({
      next: () => {
        this.enviando = false;
        this.comentarioForm.reset();
        this.cargarDetalle();
      },
      error: (err) => {
        this.enviando = false;
        this.errorMsg = err.error?.mensaje || err.error?.message || 'Error al publicar comentario.';
      }
    });
  }

  eliminarComentario(idComentario?: number): void {
    if (!idComentario || !confirm('¿Eliminar este comentario?')) return;
    this.foroService.eliminarComentario(idComentario).subscribe({
      next: () => this.cargarDetalle(),
      error: () => (this.errorMsg = 'No se pudo eliminar el comentario.')
    });
  }
}