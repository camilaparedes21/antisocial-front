// Usuario como lo devuelve la API (sin contraseña)
export interface User {
  _id: string;
  nickName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Tag {
  _id: string;
  name: string;
}

export interface PostImage {
  _id: string;
  imageUrl: string;
}

export interface Comment {
  _id: string;
  content: string;
  date: string;
  idUser: { _id: string; nickName: string };
}

// Post tal como viene en GET /posts (feed y perfil)
export interface Post {
  _id: string;
  description: string;
  idUser: { _id: string; nickName: string };
  tags: Tag[];
  imagen: PostImage[];
  createdAt: string;
  cantidadComentarios: number;
}

// Post tal como viene en GET /posts/:id (detalle, trae los comentarios)
export interface PostDetail extends Omit<Post, 'cantidadComentarios'> {
  comentarios: Comment[];
}