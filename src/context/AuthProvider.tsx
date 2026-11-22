import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from '../types';

const STORAGE_KEY = 'usuario';

// Lee el usuario guardado (si hay) al cargar la app
function leerUsuarioGuardado(): User | null {
  const guardado = localStorage.getItem(STORAGE_KEY);
  return guardado ? JSON.parse(guardado) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(leerUsuarioGuardado);

  const loginUser = (usuario: User) => {
    setUser(usuario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}