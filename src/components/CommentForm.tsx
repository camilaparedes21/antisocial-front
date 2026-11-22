import { useState, type FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { crearComentario } from '../services/api';
import type { Comment } from '../types';

interface Props {
  postId: string;
  userId: string;
  onComentarioCreado: (comentario: Comment) => void;
}

function CommentForm({ postId, userId, onComentarioCreado }: Props) {
  const [contenido, setContenido] = useState('');
  const [validado, setValidado] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidado(true);
    setError('');

    if (!contenido.trim()) return;   // campo obligatorio

    try {
      setEnviando(true);
      const nuevo = await crearComentario(postId, userId, contenido.trim());
      onComentarioCreado(nuevo);   // avisa al padre para que lo agregue a la lista
      setContenido('');
      setValidado(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit} className="mb-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Escribí un comentario..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          isInvalid={validado && !contenido.trim()}
        />
        <Form.Control.Feedback type="invalid">El comentario no puede estar vacío</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Comentar'}
      </Button>
    </Form>
  );
}

export default CommentForm;