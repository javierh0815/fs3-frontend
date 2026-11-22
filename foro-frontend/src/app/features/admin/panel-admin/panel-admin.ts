import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForoService } from '../../../core/services/foro';
import { UsuarioService } from '../../../core/services/usuario';
import { Categoria } from '../../../core/models/foro.model';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdminComponent implements OnInit {
  private fb = inject(FormBuilder);
  private foroService = inject(ForoService);
  private usuarioService = inject(UsuarioService);

  categorias: Categoria[] = [];
  usuarios: Usuario[] = [];
  mensaje = '';
  errorMsg = '';

  categoriaForm = this.fb.nonNullable.group({
    nombreCategoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.foroService.getCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: () => (this.errorMsg = 'Error al cargar categorías.')
    });

    this.usuarioService.getAll().subscribe({
      next: (data) => (this.usuarios = data),
      error: () => (this.errorMsg = 'Error al cargar usuarios.')
    });
  }

  crearCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.foroService.crearCategoria(this.categoriaForm.getRawValue()).subscribe({
      next: () => {
        this.mensaje = 'Categoría creada correctamente.';
        this.errorMsg = '';
        this.categoriaForm.reset();
        this.cargarTodo();
      },
      error: (err) => {
        this.errorMsg = err.error?.mensaje || 'No se pudo crear la categoría.';
      }
    });
  }

  eliminarCategoria(id?: number): void {
    if (!id || !confirm('¿Eliminar esta categoría?')) return;
    this.foroService.eliminarCategoria(id).subscribe({
      next: () => {
        this.mensaje = 'Categoría eliminada.';
        this.cargarTodo();
      },
      error: () => (this.errorMsg = 'Error al eliminar categoría (puede tener temas asociados).')
    });
  }

  eliminarUsuario(id?: number): void {
    if (!id || !confirm('¿Eliminar este usuario permanentemente?')) return;
    this.usuarioService.delete(id).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado.';
        this.cargarTodo();
      },
      error: () => (this.errorMsg = 'No se pudo eliminar el usuario.')
    });
  }
}