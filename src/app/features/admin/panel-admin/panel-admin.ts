import { Component, OnInit, inject, signal } from '@angular/core';
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

  categorias = signal<Categoria[]>([]);
  usuarios = signal<Usuario[]>([]);
  mensaje = signal<string>('');
  errorMsg = signal<string>('');

  categoriaForm = this.fb.nonNullable.group({
    nombreCategoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.foroService.getCategorias().subscribe({
      next: (data) => this.categorias.set(data),
      error: () => this.errorMsg.set('Error al cargar categorías.')
    });

    this.usuarioService.getAll().subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.errorMsg.set('Error al cargar usuarios.')
    });
  }

  crearCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.foroService.crearCategoria(this.categoriaForm.getRawValue()).subscribe({
      next: () => {
        this.mensaje.set('Categoría creada correctamente.');
        this.errorMsg.set('');
        this.categoriaForm.reset();
        this.cargarTodo();
      },
      error: (err) => {
        this.errorMsg.set(err.error?.mensaje || 'No se pudo crear la categoría.');
      }
    });
  }

  eliminarCategoria(id?: number): void {
    if (!id || !confirm('¿Eliminar esta categoría?')) return;
    this.foroService.eliminarCategoria(id).subscribe({
      next: () => {
        this.mensaje.set('Categoría eliminada.');
        this.cargarTodo();
      },
      error: () => this.errorMsg.set('Error al eliminar categoría (puede tener temas asociados).')
    });
  }

  eliminarUsuario(id?: number): void {
    if (!id || !confirm('¿Eliminar este usuario permanentemente?')) return;
    this.usuarioService.delete(id).subscribe({
      next: () => {
        this.mensaje.set('Usuario eliminado.');
        this.cargarTodo();
      },
      error: () => this.errorMsg.set('No se pudo eliminar el usuario.')
    });
  }
}