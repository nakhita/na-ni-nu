import { useState } from "react"
import CarritoContexto from "./CarritoContexto"

function CarritoProveedor({ children }) {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      )

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }

      return [
        ...carritoActual,
        {
          ...producto,
          cantidad: 1
        }
      ]
    })
  }

  const aumentarCantidad = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.id === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    )
  }

  const disminuirCantidad = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    )
  }

  const eliminarDelCarrito = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.id !== id)
    )
  }

  const restaurarProducto = (producto, posicion) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      )

      if (productoExistente) {
        return carritoActual
      }

      const nuevoCarrito = [...carritoActual]

      nuevoCarrito.splice(posicion, 0, producto)

      return nuevoCarrito
    })
  }

  return (
    <CarritoContexto.Provider
      value={{
        carrito,
        agregarAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarDelCarrito,
        restaurarProducto
      }}
    >
      {children}
    </CarritoContexto.Provider>
  )
}

export default CarritoProveedor