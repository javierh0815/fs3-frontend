export interface Categoria {
  idCategoria?: number;
  codigoCategoria?: number;
  nombreCategoria: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  fechaCierre?: string;
}

export interface Tema {
  idTema?: number;
  codigoTema?: number;
  titulo: string;
  codUsuario: number;
  nombreUsuario?: string;
  idCategoria: number;
  nombreCategoria?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  fechaCierre?: string;
}

export interface Comentario {
  idComentario?: number;
  codigoComentario?: number;
  contenido: string;
  codUsuario: number;
  nombreUsuario?: string;
  idTema: number;
  tituloTema?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  fechaCierre?: string;
}