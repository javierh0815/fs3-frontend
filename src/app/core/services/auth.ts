import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, Usuario } from '../models/usuario.model';

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.userApiUrl}/usuarios`;
  private readonly STORAGE_KEY = 'foro_usuario_activo';

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res) => {
        if (res && res.usuario) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(res.usuario));
        }
      })
    );
  }

  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getUsuarioActual(): Usuario | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? (JSON.parse(data) as Usuario) : null;
  }

  estaAutenticado(): boolean {
    return this.getUsuarioActual() !== null;
  }

  esAdminOModerador(): boolean {
    const rol = this.getUsuarioActual()?.rolUsuario?.toUpperCase();
    return rol === 'ADMIN' || rol === 'MODERADOR';
  }
}