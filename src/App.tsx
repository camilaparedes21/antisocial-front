import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PostDetalle from './pages/PostDetalle';
import Perfil from './pages/Perfil';
import CrearPost from './pages/CrearPost';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/post/:id" element={<PostDetalle />} />

          {/* Rutas protegidas: solo con usuario logueado */}
          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/crear" element={<CrearPost />} />
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;