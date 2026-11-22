import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForoService } from '../../../core/services/foro';
import { AuthService } from '../../../core/services/auth';
import { Categoria, Tema } from '../../../core/models/foro.model';

@Component({
  selector: 'app-temas',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './temas.html',
  styleUrl: './temas.css'
})
export class TemasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private foroService = inject(ForoService);
  authService = inject(AuthService);

  idCategoria!: number;
  categoria?: Categoria;
  temas: Tema[] = [];
  cargando = true;
  enviando = false;
  errorMsg = '';

  temaForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    this.idCategoria = Number(this.route.snapshot.paramMap.get('idCategoria'));
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.foroService.getCategoriaById(this.idCategoria).subscribe({
      next: (cat) => (this.categoria = cat)
    });

    this.foroService.getTemasByCategoria(this.idCategoria).subscribe({
      next: (data) => {
        this.temas = data;
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar los temas de esta categoría.';
        this.cargando = false;
      }
    });
  }

  crearTema(): void {
    if (this.temaForm.invalid) {
      this.temaForm.markAllAsTouched();
      return;
    }

    const usuario = this.authService.getUsuarioActual();
    if (!usuario || !usuario.codUsuario) {
      this.errorMsg = 'No se encontró el código de usuario en la sesión.';
      return;
    }

    this.enviando = true;
    this.errorMsg = '';

    const nuevoTema: Tema = {
      titulo: this.temaForm.getRawValue().titulo,
      codUsuario: usuario.codUsuario,
      idCategoria: this.idCategoria
    };

    this.foroService.crearTema(nuevoTema).subscribe({
      next: () => {
        this.enviando = false;
        this.temaForm.reset();
        this.cargarDatos();
      },
      error: (err) => {
        this.enviando = false;
        this.errorMsg = err.error?.mensaje || err.error?.message || 'Error al crear el tema.';
      }
    });
  }

  eliminarTema(idTema?: number): void {
    if (!idTema || !confirm('¿Seguro que deseas eliminar este tema?')) return;
    this.foroService.eliminarTema(idTema).subscribe({
      next: () => this.cargarDatos(),
      error: () => (this.errorMsg = 'No se pudo eliminar el tema.')
    });
  }
}