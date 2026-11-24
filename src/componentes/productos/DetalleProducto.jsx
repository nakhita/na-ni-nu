import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useCarrito } from "../../hooks/useCarrito"
import { obtenerProductoPorId } from "../../servicios/productosServicio"

function DetalleProducto() {
  const { id } = useParams()

  const {
    carrito,
    agregarAlCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito
  } = useCarrito()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true

    obtenerProductoPorId(id)
      .then((datos) => {
        if (activo) {
          setProducto(datos)
          setError(null)
        }
      })
      .catch((err) => {
        if (activo) {
          setError(err.message || "Error al cargar el producto")
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false)
        }
      })

    return () => {
      activo = false
    }
  }, [id])

  if (cargando) {
    return <p>Cargando producto...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!producto) {
    return <p>Producto no encontrado.</p>
  }

  const productoEnCarrito = carrito.find(
    (item) => String(item.id) === String(producto.id)
  )

  const cantidad = productoEnCarrito
    ? productoEnCarrito.cantidad
    : 0

  return (
    <section>
      <h2>{producto.nombre}</h2>

      <p>Sección: {producto.seccion}</p>

      <p>Categoría: {producto.categoria}</p>

      <p>{producto.descripcion}</p>

      <p>Precio: ${producto.precio}</p>

      {producto.gramos && (
        <p>Gramaje: {producto.gramos} g</p>
      )}

      {producto.tipoHoja && producto.tipoHoja !== "-" && (
        <p>Tipo de hoja: {producto.tipoHoja}</p>
      )}

      {cantidad === 0 ? (
        <button onClick={() => agregarAlCarrito(producto)}>
          Agregar al carrito
        </button>
      ) : (
        <div>
          {cantidad === 1 ? (
            <button
              onClick={() => eliminarDelCarrito(producto.id)}
              aria-label="Eliminar del carrito"
            >
              🗑️
            </button>
          ) : (
            <button
              onClick={() => disminuirCantidad(producto.id)}
              aria-label="Disminuir cantidad"
            >
              -
            </button>
          )}

          <span>{cantidad}</span>

          <button
            onClick={() => aumentarCantidad(producto.id)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      )}
    </section>
  )
}

export default DetalleProducto