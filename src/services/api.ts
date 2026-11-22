import type { User, Post, PostDetail, Tag, Comment } from '../types';

const API_URL = 'http://localhost:3000';

// Hace el fetch y, si la API responde con error, lanza un Error con su mensaje
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();

  if (!res.ok) {
    // Si hay detalles de validación (Joi), los mostramos; si no, el mensaje general
    const mensaje = data.details
      ? data.details.map((d: { message: string }) => d.message).join('. ')
      : data.error;
    throw new Error(mensaje || 'Ocurrió un error');
  }
  return data;
}

// ---------- Usuarios ----------
export function login(nickName: string, password: string) {
  return request<User>('/users/login', {
    method: 'POST',
    body: JSON.stringify({ nickName, password }),
  });
}

export interface NuevoUsuario {
  nickName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function registrar(usuario: NuevoUsuario) {
  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify(usuario),
  });
}

// ---------- Posts ----------
export async function getPosts(userId?: string) {
  const query = userId ? `?userId=${userId}` : '';
  const data = await request<{ publicaciones: Post[] }>(`/posts${query}`);
  return data.publicaciones;
}

export async function getPost(id: string) {
  const data = await request<{ publicacion: PostDetail }>(`/posts/${id}`);
  return data.publicacion;
}

export async function crearPost(description: string, userId: string, tags: string[]) {
  const data = await request<{ publicacion: { _id: string } }>('/posts', {
    method: 'POST',
    body: JSON.stringify({ description, userId, tags }),
  });
  return data.publicacion;
}

export function agregarImagen(postId: string, url: string) {
  return request(`/posts/${postId}/images`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

// ---------- Comentarios y etiquetas ----------
export function crearComentario(postId: string, userId: string, content: string) {
  return request<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ userId, content }),
  });
}

export function getTags() {
  return request<Tag[]>('/tags');
}