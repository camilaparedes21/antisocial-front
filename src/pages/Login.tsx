import { useState, type FormEvent } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/useAuth';

function Login() {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [validado, setValidado] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidado(true);
    setError('');

    // Validación en el front: campos obligatorios
    if (!nickName.trim() || !password) return;

    try {
      setCargando(true);
      const usuario = await login(nickName.trim(), password);
      loginUser(usuario);   // lo guarda en el contexto y en localStorage
      navigate('/');
    } catch (err) {
      setError((err as Error).message);   // ej.: "Usuario o contraseña incorrectos"
    } finally {
      setCargando(false);
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <h2 className="mb-4 text-center">Iniciar sesión</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>NickName</Form.Label>
            <Form.Control
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              isInvalid={validado && !nickName.trim()}
            />
            <Form.Control.Feedback type="invalid">El nickName es obligatorio</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={validado && !password}
            />
            <Form.Control.Feedback type="invalid">La contraseña es obligatoria</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="w-100" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Form>

        <p className="mt-3 text-center">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </Card.Body>
    </Card>
  );
}

export default Login;