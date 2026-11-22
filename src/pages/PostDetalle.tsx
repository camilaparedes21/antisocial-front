import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Badge, Button, Spinner, Alert, Row, Col, ListGroup } from 'react-bootstrap';
import CommentForm from '../components/CommentForm';
import { getPost } from '../services/api';
import { useAuth } from '../context/useAuth';
import type { PostDetail, Comment } from '../types';

function PostDetalle() {
  const { id } = useParams();   // el :id de la URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Se vuelve a ejecutar si cambia el id de la URL
  useEffect(() => {
    if (!id) return;
    getPost(id)
      .then(setPost)
      .catch((err: Error) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  // Agrega el comentario nuevo arriba de la lista, sin volver a pedir todo el post
  const agregarComentario = (comentario: Comment) => {
    if (!post) return;
    setPost({ ...post, comentarios: [comentario, ...post.comentarios] });
  };

  if (cargando) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!post) return null;

  return (
    <>
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Volver
      </Button>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Subtitle className="mb-2 text-muted">@{post.idUser.nickName}</Card.Subtitle>
          <Card.Text className="fs-5">{post.description}</Card.Text>

          {post.imagen.length > 0 && (
            <Row xs={1} md={2} className="g-3 mb-3">
              {post.imagen.map((img) => (
                <Col key={img._id}>
                  <img src={img.imageUrl} alt="Imagen del post" className="img-fluid rounded" />
                </Col>
              ))}
            </Row>
          )}

          <div>
            {post.tags.map((tag) => (
              <Badge bg="secondary" className="me-1" key={tag._id}>#{tag.name}</Badge>
            ))}
          </div>
        </Card.Body>
      </Card>

      <h4 className="mb-3">Comentarios ({post.comentarios.length})</h4>

      {user ? (
        <CommentForm postId={post._id} userId={user._id} onComentarioCreado={agregarComentario} />
      ) : (
        <Alert variant="info">
          <Link to="/login">Iniciá sesión</Link> para comentar.
        </Alert>
      )}

      {post.comentarios.length === 0 ? (
        <p className="text-muted">Todavía no hay comentarios.</p>
      ) : (
        <ListGroup>
          {post.comentarios.map((c) => (
            <ListGroup.Item key={c._id}>
              <strong>@{c.idUser.nickName}</strong>{' '}
              <small className="text-muted">{new Date(c.date).toLocaleDateString('es-AR')}</small>
              <div>{c.content}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}

export default PostDetalle;