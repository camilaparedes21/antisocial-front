import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card, InputGroup } from 'react-bootstrap';
import { crearPost, agregarImagen, getTags } from '../services/api';
import { useAuth } from '../context/useAuth';
import type { Tag } from '../types';

const esUrlValida = (url: string) => /^https?:\/\/\S+$/.test(url.trim());

function CrearPost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState('');
  const [urls, setUrls] = useState<string[]>(['']);              // arranca con un campo vacío
  const [tagsDisponibles, setTagsDisponibles] = useState<Tag[]>([]);
  const [tagsElegidas, setTagsElegidas] = useState<string[]>([]); // ids de las etiquetas marcadas

  const [validado, setValidado] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Trae la lista de etiquetas desde la API al montar
  useEffect(() => {
    getTags()
      .then(setTagsDisponibles)
      .catch((err: Error) => setError(err.message));
  }, []);

  // ----- Manejo de la lista de URLs -----
  const cambiarUrl = (index: number, valor: string) => {
    setUrls(urls.map((u, i) => (i === index ? valor : u)));
  };
  const agregarCampoUrl = () => setUrls([...urls, '']);
  const quitarCampoUrl = (index: number) => setUrls(urls.filter((_, i) => i !== index));

  // ----- Manejo de etiquetas (marcar / desmarcar) -----
  const toggleTag = (id: string) => {
    setTagsElegidas((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidado(true);
    setError('');

    const urlsCargadas = urls.map((u) => u.trim()).filter((u) => u !== '');

    // Validaciones: descripción obligatoria y URLs con formato válido
    if (!descripcion.trim()) return;
    if (urlsCargadas.some((u) => !esUrlValida(u))) return;
    if (!user) return;

    try {
      setEnviando(true);

      // 1) Crea el post con descripción, userId y tags
      const post = await crearPost(descripcion.trim(), user._id, tagsElegidas);

      // 2) Por cada URL, asocia la imagen al post recién creado
      await Promise.all(urlsCargadas.map((url) => agregarImagen(post._id, url)));

      // 3) Redirige al perfil
      navigate('/perfil');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 640 }}>
      <Card.Body>
        <h2 className="mb-4">Nueva publicación</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          {/* Descripción */}
          <Form.Group className="mb-4">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              isInvalid={validado && !descripcion.trim()}
            />
            <Form.Control.Feedback type="invalid">La descripción es obligatoria</Form.Control.Feedback>
          </Form.Group>

          {/* URLs de imágenes */}
          <Form.Group className="mb-4">
            <Form.Label>Imágenes (opcional)</Form.Label>
            {urls.map((url, index) => (
              <InputGroup className="mb-2" key={index} hasValidation>
                <Form.Control
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => cambiarUrl(index, e.target.value)}
                  isInvalid={validado && url.trim() !== '' && !esUrlValida(url)}
                />
                {urls.length > 1 && (
                  <Button variant="outline-danger" onClick={() => quitarCampoUrl(index)}>✕</Button>
                )}
                <Form.Control.Feedback type="invalid">
                  La URL debe empezar con http:// o https://
                </Form.Control.Feedback>
              </InputGroup>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={agregarCampoUrl}>
              + Agregar otra imagen
            </Button>
          </Form.Group>

          {/* Etiquetas */}
          <Form.Group className="mb-4">
            <Form.Label>Etiquetas</Form.Label>
            {tagsDisponibles.length === 0 ? (
              <p className="text-muted small">No hay etiquetas disponibles.</p>
            ) : (
              <div>
                {tagsDisponibles.map((tag) => (
                  <Form.Check
                    inline
                    type="checkbox"
                    key={tag._id}
                    id={`tag-${tag._id}`}
                    label={`#${tag.name}`}
                    checked={tagsElegidas.includes(tag._id)}
                    onChange={() => toggleTag(tag._id)}
                  />
                ))}
              </div>
            )}
          </Form.Group>

          <Button type="submit" className="w-100" disabled={enviando}>
            {enviando ? 'Publicando...' : 'Publicar'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default CrearPost;