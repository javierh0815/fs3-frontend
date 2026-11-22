import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ForoService } from '../../../core/services/foro';
import { Categoria } from '../../../core/models/foro.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {
  private foroService = inject(ForoService);

  categorias = signal<Categoria[]>([]);
  cargando = signal<boolean>(true);
  errorMsg = signal<string>('');

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando.set(true);
    this.foroService.getCategorias().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.errorMsg.set('No se pudieron cargar las categorías. Verifica que el microservicio threads esté activo.');
        this.cargando.set(false);
      }
    });
  }
}