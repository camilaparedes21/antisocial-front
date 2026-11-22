import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function NavBar() {
  const { user } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Anti-Social Net</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu" />
        <Navbar.Collapse id="menu">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/crear">Nueva publicación</Nav.Link>
                <Nav.Link as={Link} to="/perfil">{user.nickName}</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={Link} to="/registro">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;