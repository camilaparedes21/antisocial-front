import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import Avatar from './Avatar';

interface Props {
  post: Post;
}

function PostCard({ post }: Props) {
  const primeraImagen = post.imagen[0];

  return (
    <Card className="h-100 shadow-sm as-card">
      {primeraImagen && (
        <Card.Img
          variant="top"
          src={primeraImagen.imageUrl}
          alt="Imagen del post"
          style={{ height: 200, objectFit: 'cover' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-2">
         <Avatar nickName={post.idUser.nickName} size={32} />
         <span className="fw-medium">@{post.idUser.nickName}</span>
        </div>
        <Card.Text>{post.description}</Card.Text>

        <div className="mb-3">
          {post.tags.map((tag) => (
            <Badge className="me-1 as-tag" key={tag._id}>
              #{tag.name}
            </Badge>
          ))}
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">💬 {post.cantidadComentarios} comentarios</small>
          <Link to={`/post/${post._id}`} className="btn btn-primary btn-sm">
             Ver más
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PostCard;