import { useState } from "react"
import {
  validarProducto,
  CATEGORIAS_LIBRERIA,
  CATEGORIAS_IMPRENTA
} from "../../utilidades/validarProducto"

function FormularioProducto({ productoAEditar = null, onSubmit, onCancelar, cargando = false }) {
  const esEdicion = Boolean(productoAEditar)

  const [valores, setValores] = useState(() => {
    if (productoAEditar) {
      return {
        nombre: productoAEditar.nombre || "",
        precio: productoAEditar.precio !== undefined ? String(productoAEditar.precio) : "",
        seccion: productoAEditar.seccion || "libreria",
        categoria: productoAEditar.categoria || "archivo",
        descripcion: productoAEditar.descripcion || "",
        imagen: productoAEditar.imagen || "",
        gramos: productoAEditar.gramos !== undefined ? String(productoAEditar.gramos) : "",
        tipoHoja: productoAEditar.tipoHoja || ""
      }
    }
    return {
      nombre: "",
      precio: "",
      seccion: "libreria",
      categoria: "archivo",
      descripcion: "",
      imagen: "/imagenes/libreria/afiche.jpeg",
      gramos: "",
      tipoHoja: ""
    }
  })

  const [errores, setErrores] = useState({})

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setValores((prev) => {
      const nuevo = { ...prev, [name]: value }

      // Si cambia la sección, asignar la primera categoría válida de esa sección
      if (name === "seccion") {
        if (value === "libreria") {
          nuevo.categoria = CATEGORIAS_LIBRERIA[0]
          nuevo.gramos = ""
          nuevo.tipoHoja = ""
        } else if (value === "imprenta") {
          nuevo.categoria = CATEGORIAS_IMPRENTA[0]
        }
      }

      return nuevo
    })

    if (errores[name]) {
      setErrores((prev) => {
        const copia = { ...prev }
        delete copia[name]
        return copia
      })
    }
  }

  const manejarEnvio = (e) => {
    e.preventDefault()

    const resultado = validarProducto(valores)

    if (!resultado.esValido) {
      setErrores(resultado.errores)
      return
    }

    // Preparar objeto para enviar normalizado
    const payload = {
      nombre: valores.nombre.trim(),
      precio: Number(valores.precio),
      seccion: valores.seccion,
      categoria: valores.categoria,
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim()
    }

    if (valores.seccion === "imprenta") {
      payload.gramos = Number(valores.gramos)
      payload.tipoHoja = valores.tipoHoja.trim()
    }

    onSubmit(payload)
  }

  const categoriasDisponibles =
    valores.seccion === "imprenta" ? CATEGORIAS_IMPRENTA : CATEGORIAS_LIBRERIA

  return (
    <form onSubmit={manejarEnvio} className="formularioProductoAdmin">
      <div className="grupoFormulario">
        <label htmlFor="prod-nombre">Nombre del Producto *</label>
        <input
          id="prod-nombre"
          name="nombre"
          type="text"
          value={valores.nombre}
          onChange={manejarCambio}
          placeholder="Ej: Cuaderno Universitario"
        />
        {errores.nombre && <span className="mensajeErrorCampo">{errores.nombre}</span>}
      </div>

      <div className="filaFormularioDoble">
        <div className="grupoFormulario">
          <label htmlFor="prod-seccion">Sección *</label>
          <select
            id="prod-seccion"
            name="seccion"
            value={valores.seccion}
            onChange={manejarCambio}
          >
            <option value="libreria">Librería</option>
            <option value="imprenta">Imprenta</option>
          </select>
          {errores.seccion && <span className="mensajeErrorCampo">{errores.seccion}</span>}
        </div>

        <div className="grupoFormulario">
          <label htmlFor="prod-categoria">Categoría *</label>
          <select
            id="prod-categoria"
            name="categoria"
            value={valores.categoria}
            onChange={manejarCambio}
          >
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          {errores.categoria && <span className="mensajeErrorCampo">{errores.categoria}</span>}
        </div>
      </div>

      <div className="filaFormularioDoble">
        <div className="grupoFormulario">
          <label htmlFor="prod-precio">Precio ($) *</label>
          <input
            id="prod-precio"
            name="precio"
            type="number"
            step="0.01"
            value={valores.precio}
            onChange={manejarCambio}
            placeholder="0.00"
          />
          {errores.precio && <span className="mensajeErrorCampo">{errores.precio}</span>}
        </div>

        <div className="grupoFormulario">
          <label htmlFor="prod-imagen">Ruta de Imagen *</label>
          <input
            id="prod-imagen"
            name="imagen"
            type="text"
            value={valores.imagen}
            onChange={manejarCambio}
            placeholder="/imagenes/libreria/afiche.jpeg"
          />
          {errores.imagen && <span className="mensajeErrorCampo">{errores.imagen}</span>}
        </div>
      </div>

      {valores.seccion === "imprenta" && (
        <div className="filaFormularioDoble contenedorCamposImprenta">
          <div className="grupoFormulario">
            <label htmlFor="prod-gramos">Gramaje (g) * (Imprenta)</label>
            <input
              id="prod-gramos"
              name="gramos"
              type="number"
              value={valores.gramos}
              onChange={manejarCambio}
              placeholder="Ej: 80, 150, 300"
            />
            {errores.gramos && <span className="mensajeErrorCampo">{errores.gramos}</span>}
          </div>

          <div className="grupoFormulario">
            <label htmlFor="prod-tipoHoja">Tipo de Hoja * (Imprenta)</label>
            <input
              id="prod-tipoHoja"
              name="tipoHoja"
              type="text"
              value={valores.tipoHoja}
              onChange={manejarCambio}
              placeholder="Ej: Obra, Ilustración, Fotográfico"
            />
            {errores.tipoHoja && <span className="mensajeErrorCampo">{errores.tipoHoja}</span>}
          </div>
        </div>
      )}

      <div className="grupoFormulario">
        <label htmlFor="prod-descripcion">Descripción *</label>
        <textarea
          id="prod-descripcion"
          name="descripcion"
          rows={4}
          value={valores.descripcion}
          onChange={manejarCambio}
          placeholder="Descripción detallada del producto para los clientes..."
        />
        {errores.descripcion && <span className="mensajeErrorCampo">{errores.descripcion}</span>}
      </div>

      <div className="accionesFormularioAdmin">
        <button
          type="button"
          onClick={onCancelar}
          className="botonSecundario"
          disabled={cargando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="botonPrimario"
          disabled={cargando}
        >
          {cargando
            ? "Guardando..."
            : esEdicion
              ? "Guardar Cambios"
              : "Crear Producto"}
        </button>
      </div>
    </form>
  )
}

export default FormularioProducto
