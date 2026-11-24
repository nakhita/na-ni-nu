import { useEffect, useState } from "react"
import ItemLista from "./ItemLista"
import Paginador from "./Paginador"
import { obtenerProductosPorSeccion } from "../../servicios/productosServicio"
import { useBusqueda } from "../../hooks/useBusqueda"
import { usePaginacion } from "../../hooks/usePaginacion"

function ItemListaContenedor({ seccion }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const { termino, limpiarBusqueda } = useBusqueda()

  useEffect(() => {
    let activo = true

    obtenerProductosPorSeccion(seccion)
      .then((datos) => {
        if (activo) {
          setProductos(datos)
          setError(null)
        }
      })
      .catch((err) => {
        if (activo) {
          setError(err.message || "Error al cargar los productos")
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
  }, [seccion])

  // Normalización para búsqueda tolerante a mayúsculas, minúsculas y tildes
  const normalizarTexto = (texto) =>
    (texto || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

  const terminoNormalizado = normalizarTexto(termino.trim())

  const productosFiltrados = terminoNormalizado
    ? productos.filter((producto) => {
        const nombreNorm = normalizarTexto(producto.nombre)
        const descNorm = normalizarTexto(producto.descripcion)
        const catNorm = normalizarTexto(producto.categoria)
        return (
          nombreNorm.includes(terminoNormalizado) ||
          descNorm.includes(terminoNormalizado) ||
          catNorm.includes(terminoNormalizado)
        )
      })
    : productos

  const {
    paginaActual,
    totalPaginas,
    elementosPaginados,
    irAPagina,
    paginaSiguiente,
    paginaAnterior
  } = usePaginacion(productosFiltrados, 12)

  const titulo =
    seccion === "libreria"
      ? "Librería"
      : seccion === "imprenta"
        ? "Imprenta"
        : "Catálogo"

  return (
    <section className="catalogoSeccion">
      <div className="encabezadoCatalogo">
        <div>
          <h2>{titulo}</h2>
          {termino.trim() && (
            <p className="resumenBusquedaTexto">
              Resultados para &quot;<strong>{termino}</strong>&quot; ({productosFiltrados.length}{" "}
              {productosFiltrados.length === 1 ? "producto" : "productos"})
            </p>
          )}
        </div>
        <p className="contadorTotalCatalogo">
          Página {paginaActual} de {totalPaginas} | Mostrando {elementosPaginados.length} de {productosFiltrados.length} productos
        </p>
      </div>

      {cargando && (
        <div className="estadoCargando">
          <p>Cargando productos...</p>
        </div>
      )}

      {error && (
        <div className="estadoError">
          <p>Error: {error}</p>
        </div>
      )}

      {!cargando && !error && productosFiltrados.length === 0 && (
        <div className="estadoVacio">
          <p>
            {termino.trim()
              ? `No se encontraron productos que coincidan con "${termino}".`
              : "No se encontraron productos disponibles en esta sección."}
          </p>
          {termino.trim() && (
            <button
              type="button"
              className="botonSecundario"
              onClick={limpiarBusqueda}
              style={{ marginTop: "12px" }}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {!cargando && !error && productosFiltrados.length > 0 && (
        <>
          <ItemLista productos={elementosPaginados} />
          <Paginador
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onCambiarPagina={irAPagina}
            onAnterior={paginaAnterior}
            onSiguiente={paginaSiguiente}
          />
        </>
      )}
    </section>
  )
}

export default ItemListaContenedor