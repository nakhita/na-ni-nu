import { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../../servicios/productosServicio"
import ListaProductosAdmin from "./ListaProductosAdmin"
import FormularioProducto from "./FormularioProducto"

function PanelAdministracion() {
  const { usuario } = useAuth()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [cargandoAccion, setCargandoAccion] = useState(false)
  const [error, setError] = useState(null)
  const [mensajeExito, setMensajeExito] = useState(null)

  const [vista, setVista] = useState("lista") // "lista" | "formulario"
  const [productoAEditar, setProductoAEditar] = useState(null)

  useEffect(() => {
    let activo = true

    obtenerProductos()
      .then((datos) => {
        if (activo) {
          setProductos(datos)
          setError(null)
        }
      })
      .catch((err) => {
        if (activo) {
          setError(err.message || "Error al cargar la lista de productos")
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
  }, [])

  const mostrarExitoTemporal = (mensaje) => {
    setMensajeExito(mensaje)
    setTimeout(() => {
      setMensajeExito(null)
    }, 4000)
  }

  const iniciarCreacion = () => {
    setProductoAEditar(null)
    setVista("formulario")
    setError(null)
  }

  const iniciarEdicion = (producto) => {
    setProductoAEditar(producto)
    setVista("formulario")
    setError(null)
  }

  const cancelarFormulario = () => {
    setProductoAEditar(null)
    setVista("lista")
    setError(null)
  }

  const manejarGuardarProducto = async (datosProducto) => {
    setCargandoAccion(true)
    setError(null)

    try {
      if (productoAEditar) {
        // Modo edición
        const productoActualizado = await actualizarProducto(productoAEditar.id, datosProducto)
        setProductos((prev) =>
          prev.map((item) =>
            String(item.id) === String(productoAEditar.id)
              ? { ...item, ...productoActualizado }
              : item
          )
        )
        mostrarExitoTemporal(`Producto "${datosProducto.nombre}" actualizado con éxito.`)
      } else {
        // Modo creación
        const nuevoProducto = await crearProducto(datosProducto)
        setProductos((prev) => [nuevoProducto, ...prev])
        mostrarExitoTemporal(`Producto "${datosProducto.nombre}" creado exitosamente.`)
      }

      setProductoAEditar(null)
      setVista("lista")
    } catch (err) {
      setError(err.message || "Error al procesar la operación en Firestore.")
    } finally {
      setCargandoAccion(false)
    }
  }

  const manejarEliminarProducto = async (producto) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente el producto "${producto.nombre}"?\nEsta acción no se puede deshacer.`
    )

    if (!confirmar) {
      return
    }

    setCargandoAccion(true)
    setError(null)

    try {
      await eliminarProducto(producto.id)
      setProductos((prev) => prev.filter((item) => String(item.id) !== String(producto.id)))
      mostrarExitoTemporal(`Producto "${producto.nombre}" eliminado correctamente.`)
    } catch (err) {
      setError(err.message || "Error al eliminar el producto de Firestore.")
    } finally {
      setCargandoAccion(false)
    }
  }

  return (
    <section className="panelAdminPagina">
      <div className="encabezadoPanelAdmin">
        <div>
          <h2>Panel de Gestión y CRUD de Productos</h2>
          <p className="subtituloPanelAdmin">
            Administrador: <strong>{usuario?.email}</strong> | Total catálogo: {productos.length}
          </p>
        </div>

        <div className="accionesPanelAdmin">
          {vista === "lista" ? (
            <button
              type="button"
              className="botonPrimario"
              onClick={iniciarCreacion}
            >
              ➕ Agregar Nuevo Producto
            </button>
          ) : (
            <button
              type="button"
              className="botonSecundario"
              onClick={cancelarFormulario}
            >
              ⬅ Volver a la Lista
            </button>
          )}
        </div>
      </div>

      {mensajeExito && (
        <div className="alertaExitoAdmin">
          ✅ {mensajeExito}
        </div>
      )}

      {error && (
        <div className="alertaErrorAdmin">
          ❌ {error}
        </div>
      )}

      <div className="cuerpoPanelAdmin">
        {vista === "formulario" ? (
          <div className="contenedorFormularioAdmin">
            <h3>{productoAEditar ? `Editar Producto: ${productoAEditar.nombre}` : "Nuevo Producto"}</h3>
            <FormularioProducto
              productoAEditar={productoAEditar}
              onSubmit={manejarGuardarProducto}
              onCancelar={cancelarFormulario}
              cargando={cargandoAccion}
            />
          </div>
        ) : (
          <ListaProductosAdmin
            productos={productos}
            onEditar={iniciarEdicion}
            onEliminar={manejarEliminarProducto}
            cargando={cargando}
          />
        )}
      </div>
    </section>
  )
}

export default PanelAdministracion
