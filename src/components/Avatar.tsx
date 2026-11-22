interface Props {
  nickName: string;
  size?: number;   // opcional: si no se pasa, mide 40px
}

// Círculo con las dos primeras letras del nickName
function Avatar({ nickName, size = 40 }: Props) {
  const iniciales = nickName.slice(0, 2).toUpperCase();

  return (
    <span
      className="as-avatar"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {iniciales}
    </span>
  );
}

export default Avatar;