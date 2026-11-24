import { Link } from "react-router-dom"
import { useCarrito } from "../../hooks/useCarrito"

function Item({ producto }) {
  const {
    carrito,
    agregarAlCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito
  } = useCarrito()

  const {
    id,
    nombre,
    precio,
    descripcion,
    seccion,
    imagen,
    gramos,
    tipoHoja
  } = producto

  const productoEnCarrito = carrito.find(
    (item) => String(item.id) === String(id)
  )

  const cantidad = productoEnCarrito
    ? productoEnCarrito.cantidad
    : 0

  return (
    <article className="cardProducto">
      <div className="imagenProducto">
        {imagen ? (
          <img src={imagen} alt={nombre} />
        ) : (
          <div className="placeholderImagen">
            <span>Sin imagen</span>
          </div>
        )}
      </div>

      <div className="contenidoCardProducto">
        <span className="badgeSeccion">
          {seccion}
        </span>

        <h3>{nombre}</h3>

        <p className="descripcionProducto">
          {descripcion}
        </p>

        {gramos && (
          <p className="detalleExtra">
            Gramaje: {gramos} g
          </p>
        )}

        {tipoHoja && tipoHoja !== "-" && (
          <p className="detalleExtra">
            Tipo de hoja: {tipoHoja}
          </p>
        )}

        <p className="precioProducto">
          ${precio}
        </p>

        <div className="accionesCard">
          <Link
            to={`/producto/${id}`}
            className="botonSecundario"
          >
            Ver detalle
          </Link>

          {cantidad === 0 ? (
            <button
              className="botonPrimario"
              onClick={() => agregarAlCarrito(producto)}
            >
              Agregar al carrito
            </button>
          ) : (
            <div className="controlesCard">
              {cantidad === 1 ? (
                <button
                  className="botonControl botonEliminarCard"
                  onClick={() => eliminarDelCarrito(id)}
                  aria-label="Eliminar del carrito"
                >
                  🗑️
                </button>
              ) : (
                <button
                  className="botonControl"
                  onClick={() => disminuirCantidad(id)}
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
              )}

              <span className="cantidadCard">
                {cantidad}
              </span>

              <button
                className="botonControl"
                onClick={() => aumentarCantidad(id)}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default Item