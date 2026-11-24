import { Link } from "react-router-dom"
import { useCarrito } from "../../hooks/useCarrito"
import { useAuth } from "../../hooks/useAuth"

function Nav() {
  const { carrito } = useCarrito()
  const { usuario, esAdmin, cerrarSesion } = useAuth()

  const cantidadTotal = carrito.reduce(
    (acumulador, producto) =>
      acumulador + producto.cantidad,
    0
  )

  return (
    <nav className="nav">
      <Link to="/">Inicio</Link>
      <Link to="/libreria">Librería</Link>
      <Link to="/imprenta">Imprenta</Link>

      <Link to="/carrito" className="enlaceCarrito">
        🛒
        {cantidadTotal > 0 && (
          <span className="contadorCarrito">
            {cantidadTotal}
          </span>
        )}
      </Link>

      {esAdmin && (
        <Link to="/admin" className="enlaceAdminNav">
          ⚙️ Admin
        </Link>
      )}

      {usuario ? (
        <div className="usuarioNav">
          <span className="emailUsuarioNav" title={usuario.email}>
            👤 {usuario.email.split("@")[0]}
          </span>
          <button
            type="button"
            onClick={cerrarSesion}
            className="botonCerrarSesionNav"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      ) : (
        <Link to="/login" className="enlaceLoginNav">
          Ingresar
        </Link>
      )}
    </nav>
  )
}

export default Nav