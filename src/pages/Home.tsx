import { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { getPosts } from '../services/api';
import type { Post } from '../types';

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Se ejecuta una sola vez, al montar la página: trae el feed desde la API
  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      {/* Banner de bienvenida */}
      <div className="p-4 p-md-5 mb-4 bg-dark text-white rounded-3 text-center">
        <h1 className="display-5 fw-bold">UnaHur Anti-Social Net</h1>
        <p className="lead mb-0">La red social para los que no quieren ser sociales.</p>
      </div>

      <h2 className="mb-3">Publicaciones recientes</h2>

      {cargando && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!cargando && !error && posts.length === 0 && (
        <Alert variant="info">Todavía no hay publicaciones.</Alert>
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

export default Home;