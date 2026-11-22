import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Si hay usuario logueado muestra la ruta hija; si no, lo manda al login
function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;