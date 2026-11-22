import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registrar, type NuevoUsuario } from '../services/api';
import { useAuth } from '../context/useAuth';

const FORM_INICIAL: NuevoUsuario = {
  nickName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

// Campos del formulario: nombre en el estado, etiqueta y tipo de input
const CAMPOS: { name: keyof NuevoUsuario; label: string; type: string }[] = [
  { name: 'nickName', label: 'NickName', type: 'text' },
  { name: 'firstName', label: 'Nombre', type: 'text' },
  { name: 'lastName', label: 'Apellido', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password' },
];

function Registro() {
  const [form, setForm] = useState<NuevoUsuario>(FORM_INICIAL);
  const [validado, setValidado] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Un solo handler para todos los inputs: usa el "name" del input para saber qué campo cambiar
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidado(true);
    setError('');

    // Validación en el front: todos los campos son obligatorios
    const hayVacios = Object.values(form).some((valor) => !valor.trim());
    if (hayVacios) return;

    try {
      setCargando(true);
      const usuario = await registrar(form);
      loginUser(usuario);   // si salió bien, queda logueada directamente
      navigate('/');
    } catch (err) {
      setError((err as Error).message);   // ej.: "Ya existe un registro con nickName..."
    } finally {
      setCargando(false);
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 480 }}>
      <Card.Body>
        <h2 className="mb-4 text-center">Crear cuenta</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          {CAMPOS.map((campo) => (
            <Form.Group className="mb-3" key={campo.name}>
              <Form.Label>{campo.label}</Form.Label>
              <Form.Control
                name={campo.name}
                type={campo.type}
                value={form[campo.name]}
                onChange={handleChange}
                isInvalid={validado && !form[campo.name].trim()}
              />
              <Form.Control.Feedback type="invalid">
                {campo.label} es obligatorio
              </Form.Control.Feedback>
              {campo.name === 'password' && (
                <Form.Text muted>Entre 8 y 10 caracteres, con mayúscula, minúscula y número.</Form.Text>
              )}
            </Form.Group>
          ))}

          <Button type="submit" className="w-100" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Registrarme'}
          </Button>
        </Form>

        <p className="mt-3 text-center">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </Card.Body>
    </Card>
  );
}

export default Registro;