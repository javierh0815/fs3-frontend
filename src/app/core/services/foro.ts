import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, Comentario, Tema } from '../models/foro.model';

@Injectable({
  providedIn: 'root'
})
export class ForoService {
  private http = inject(HttpClient);
  private apiUrl = environment.threadsApiUrl;

  // --- CATEGORÍAS ---
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/categorias/${id}`);
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/categorias`, categoria);
  }

  actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/categorias/${id}`, categoria);
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categorias/${id}`);
  }

  // --- TEMAS ---
  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.apiUrl}/temas`);
  }

  getTemaById(id: number): Observable<Tema> {
    return this.http.get<Tema>(`${this.apiUrl}/temas/${id}`);
  }

  getTemasByCategoria(idCategoria: number): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.apiUrl}/temas/categoria/${idCategoria}`);
  }

  crearTema(tema: Tema): Observable<Tema> {
    return this.http.post<Tema>(`${this.apiUrl}/temas`, tema);
  }

  actualizarTema(id: number, tema: Tema): Observable<Tema> {
    return this.http.put<Tema>(`${this.apiUrl}/temas/${id}`, tema);
  }

  eliminarTema(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/temas/${id}`);
  }

  // --- COMENTARIOS ---
  getComentariosByTema(idTema: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}/comentarios/tema/${idTema}`);
  }

  crearComentario(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.apiUrl}/comentarios`, comentario);
  }

  eliminarComentario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comentarios/${id}`);
  }
}