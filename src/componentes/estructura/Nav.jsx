import { useContext } from "react"
import { Link } from "react-router-dom"
import CarritoContexto from "../../contexto/CarritoContexto"

function Nav() {
  const { carrito } = useContext(CarritoContexto)

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
    </nav>
  )
}

export default Nav