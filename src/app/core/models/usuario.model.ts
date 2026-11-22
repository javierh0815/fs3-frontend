export interface Usuario {
  idUsuario?: number;
  codUsuario?: number;
  nombreUsuario: string;
  correoUsuario: string;
  passwordUsuario?: string;
  rolUsuario: string; // 'ADMIN', 'MODERADOR', 'USUARIO'
  flagActivo?: boolean;
  fechaCreacion?: string;
}

export interface LoginRequest {
  correoUsuario: string;
  passwordUsuario: string;
}