import { Component, OnInit, inject } from '@angular/core';
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

  categorias: Categoria[] = [];
  cargando = true;
  errorMsg = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.foroService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar las categorías. Verifica que el microservicio threads esté activo.';
        this.cargando = false;
      }
    });
  }
}