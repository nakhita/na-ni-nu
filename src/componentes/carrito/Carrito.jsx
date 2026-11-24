import { useEffect, useState } from "react"
import { useCarrito } from "../../hooks/useCarrito"

function Carrito() {
  const {
    carrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    restaurarProducto,
    vaciarCarrito
  } = useCarrito()

  const [productoEliminado, setProductoEliminado] = useState(null)
  const [posicionEliminada, setPosicionEliminada] = useState(null)
  const [mostrarAviso, setMostrarAviso] = useState(false)

  const [
    productosNoSeleccionados,
    setProductosNoSeleccionados
  ] = useState([])

  useEffect(() => {
    if (!mostrarAviso) {
      return
    }

    const temporizador = setTimeout(() => {
      setMostrarAviso(false)
      setProductoEliminado(null)
      setPosicionEliminada(null)
    }, 5000)

    return () => {
      clearTimeout(temporizador)
    }
  }, [mostrarAviso])

  const estaSeleccionado = (id) => {
    return !productosNoSeleccionados.some(
      (productoId) => String(productoId) === String(id)
    )
  }

  const manejarSeleccion = (id) => {
    setProductosNoSeleccionados((actuales) => {
      const existe = actuales.some(
        (productoId) => String(productoId) === String(id)
      )

      if (existe) {
        return actuales.filter(
          (productoId) => String(productoId) !== String(id)
        )
      }

      return [...actuales, id]
    })
  }

  const todosSeleccionados =
    carrito.length > 0 &&
    carrito.every((producto) =>
      estaSeleccionado(producto.id)
    )

  const seleccionarTodos = () => {
    if (todosSeleccionados) {
      setProductosNoSeleccionados(
        carrito.map((producto) => producto.id)
      )
    } else {
      setProductosNoSeleccionados([])
    }
  }

  const manejarEliminar = (producto, posicion) => {
    const productoEstabaSeleccionado =
      estaSeleccionado(producto.id)

    setProductoEliminado({
      producto: { ...producto },
      estabaSeleccionado: productoEstabaSeleccionado
    })

    setPosicionEliminada(posicion)

    setProductosNoSeleccionados((actuales) =>
      actuales.filter(
        (productoId) => String(productoId) !== String(producto.id)
      )
    )

    eliminarDelCarrito(producto.id)
    setMostrarAviso(true)
  }

  const manejarVaciarCarrito = () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas vaciar todos los productos del carrito?"
    )

    if (!confirmar) {
      return
    }

    vaciarCarrito()
    setProductosNoSeleccionados([])
    setMostrarAviso(false)
    setProductoEliminado(null)
    setPosicionEliminada(null)
  }

  const manejarDeshacer = () => {
    if (
      !productoEliminado ||
      posicionEliminada === null
    ) {
      return
    }

    restaurarProducto(
      productoEliminado.producto,
      posicionEliminada
    )

    if (!productoEliminado.estabaSeleccionado) {
      setProductosNoSeleccionados((actuales) => [
        ...actuales,
        productoEliminado.producto.id
      ])
    }

    setMostrarAviso(false)
    setProductoEliminado(null)
    setPosicionEliminada(null)
  }

  const productosSeleccionados = carrito.filter(
    (producto) => estaSeleccionado(producto.id)
  )

  const cantidadSeleccionada =
    productosSeleccionados.reduce(
      (acumulador, producto) =>
        acumulador + producto.cantidad,
      0
    )

  const total = productosSeleccionados.reduce(
    (acumulador, producto) =>
      acumulador +
      producto.precio * producto.cantidad,
    0
  )

  return (
    <section className="carritoPagina">
      <h2 className="tituloCarrito">
        Carrito de Compras
      </h2>

      {carrito.length === 0 ? (
        <div className="carritoVacio">
          <p>Tu carrito está vacío.</p>
        </div>
      ) : (
        <>
          <div className="barraSeleccion">
            <label>
              <input
                type="checkbox"
                checked={todosSeleccionados}
                onChange={seleccionarTodos}
              />

              <span>Todos los productos ({carrito.length})</span>
            </label>

            <button
              type="button"
              className="botonVaciarCarrito"
              onClick={manejarVaciarCarrito}
              title="Vaciar todo el carrito"
            >
              🗑️ Vaciar carrito
            </button>
          </div>

          <div className="carritoDistribucion">
            <div className="listaCarrito">
              {carrito.map((producto, index) => {
                const seleccionado =
                  estaSeleccionado(producto.id)

                return (
                  <article
                    key={producto.id}
                    className={
                      seleccionado
                        ? "productoCarrito"
                        : "productoCarrito productoNoSeleccionado"
                    }
                  >
                    <div className="checkProducto">
                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() =>
                          manejarSeleccion(producto.id)
                        }
                      />
                    </div>

                    <div className="imagenProductoCarrito">
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                        />
                      ) : (
                        <div className="placeholderCarrito">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="informacionProductoCarrito">
                      <div className="tituloProductoCarrito">
                        <h3>{producto.nombre}</h3>

                        <button
                          className="basureroCarrito"
                          onClick={() =>
                            manejarEliminar(
                              producto,
                              index
                            )
                          }
                          aria-label="Eliminar producto"
                          title="Eliminar producto"
                        >
                          🗑️
                        </button>
                      </div>

                      <p className="precioUnitarioCarrito">
                        Precio unitario: ${producto.precio}
                      </p>

                      <div className="controlesCantidadCarrito">
                        <button
                          onClick={() =>
                            disminuirCantidad(producto.id)
                          }
                          disabled={
                            producto.cantidad === 1
                          }
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>

                        <span>
                          {producto.cantidad}
                        </span>

                        <button
                          onClick={() =>
                            aumentarCantidad(producto.id)
                          }
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="precioProductoCarrito">
                      <strong>
                        $
                        {producto.precio *
                          producto.cantidad}
                      </strong>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className="resumenCarrito">
              <h3>Resumen</h3>

              <div className="lineaResumen totalResumen">
                <span>Total a pagar</span>

                <strong>${total}</strong>
              </div>

              <button
                className="botonComprar"
                disabled={
                  productosSeleccionados.length === 0
                }
              >
                Finalizar compra ({cantidadSeleccionada})
              </button>
            </aside>
          </div>
        </>
      )}

      {mostrarAviso && (
        <div className="avisoEliminado">
          <span>
            ¡Listo! Eliminaste el producto.
          </span>

          <button onClick={manejarDeshacer}>
            DESHACER
          </button>
        </div>
      )}
    </section>
  )
}

export default Carrito