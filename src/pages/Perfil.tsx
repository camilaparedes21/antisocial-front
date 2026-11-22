import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Spinner, Alert, Button, Card } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { getPosts } from '../services/api';
import { useAuth } from '../context/useAuth';
import Avatar from '../components/Avatar';
import type { Post } from '../types';

function Perfil() {
  // La ruta es protegida, así que acá siempre hay un usuario
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Trae solo las publicaciones de este usuario (GET /posts?userId=...)
  useEffect(() => {
    if (!user) return;
    getPosts(user._id)
      .then(setPosts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setCargando(false));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <Card className="mb-4 shadow-sm">
        <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <Avatar nickName={user.nickName} size={64} />
          <div>
            <h2 className="mb-0">@{user.nickName}</h2>
            <small className="text-muted">{posts.length} publicaciones</small>
          </div>
        </div>
          <div className="d-flex gap-2">
            <Link to="/crear" className="btn btn-primary">Nueva publicación</Link>
            <Button variant="outline-danger" onClick={handleLogout}>Cerrar sesión</Button>
          </div>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Mis publicaciones</h3>

      {cargando && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!cargando && !error && posts.length === 0 && (
        <Alert variant="info">Todavía no publicaste nada.</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {posts.map((post) => (
          <Col key={post._id}>
            <PostCard post={post} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Perfil;