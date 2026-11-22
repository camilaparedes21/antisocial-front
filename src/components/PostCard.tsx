import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface Props {
  post: Post;
}

function PostCard({ post }: Props) {
  const primeraImagen = post.imagen[0];

  return (
    <Card className="h-100 shadow-sm">
      {primeraImagen && (
        <Card.Img
          variant="top"
          src={primeraImagen.imageUrl}
          alt="Imagen del post"
          style={{ height: 200, objectFit: 'cover' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Subtitle className="mb-2 text-muted">@{post.idUser.nickName}</Card.Subtitle>
        <Card.Text>{post.description}</Card.Text>

        <div className="mb-3">
          {post.tags.map((tag) => (
            <Badge bg="secondary" className="me-1" key={tag._id}>
              #{tag.name}
            </Badge>
          ))}
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">💬 {post.cantidadComentarios} comentarios</small>
          <Button as={Link} to={`/post/${post._id}`} size="sm">
            Ver más
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PostCard;