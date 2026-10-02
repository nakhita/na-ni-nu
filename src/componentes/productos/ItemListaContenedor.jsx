import { useEffect, useState } from "react"
import ItemLista from "./ItemLista"

function ItemListaContenedor({ seccion }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("/data/productos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los productos")
        }

        return respuesta.json()
      })
      .then((datos) => {
        setProductos(datos)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  if (cargando) {
    return <p>Cargando productos...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  const productosFiltrados = seccion
    ? productos.filter((producto) => producto.seccion === seccion)
    : productos

  const titulo =
    seccion === "libreria"
      ? "Librería"
      : seccion === "imprenta"
        ? "Imprenta"
        : "Catálogo"

  return (
    <section className="catalogoSeccion">
      <div className="encabezadoCatalogo">
        <h2>{titulo}</h2>
        <p>Productos cargados: {productosFiltrados.length}</p>
      </div>

      <ItemLista productos={productosFiltrados} />
    </section>
  )
}

export default ItemListaContenedor