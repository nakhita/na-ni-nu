export const CATEGORIAS_LIBRERIA = [
  "archivo",
  "escritura",
  "adhesivos",
  "anotador",
  "cuadernos",
  "hojas",
  "herramientas",
  "papeles"
]

export const CATEGORIAS_IMPRENTA = [
  "impresion",
  "fotocopia",
  "digitalizacion",
  "especial"
]

/**
 * Valida un objeto de producto según las reglas de negocio de Na-Ni-Nu.
 * Retorna un objeto con `{ esValido: boolean, errores: { [campo]: string } }`
 */
export function validarProducto(producto) {
  const errores = {}

  // Validación de nombre
  if (!producto.nombre || !producto.nombre.trim()) {
    errores.nombre = "El nombre del producto es obligatorio."
  } else if (producto.nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres."
  }

  // Validación de precio
  if (producto.precio === undefined || producto.precio === null || producto.precio === "") {
    errores.precio = "El precio es obligatorio."
  } else {
    const precioNum = Number(producto.precio)
    if (isNaN(precioNum)) {
      errores.precio = "El precio debe ser un número válido."
    } else if (precioNum <= 0) {
      errores.precio = "El precio debe ser mayor a 0."
    }
  }

  // Validación de sección
  if (!producto.seccion || !["libreria", "imprenta"].includes(producto.seccion)) {
    errores.seccion = "Debes seleccionar una sección válida (Librería o Imprenta)."
  }

  // Validación de categoría
  if (!producto.categoria || !producto.categoria.trim()) {
    errores.categoria = "La categoría es obligatoria."
  } else {
    const categoriasValidas =
      producto.seccion === "imprenta" ? CATEGORIAS_IMPRENTA : CATEGORIAS_LIBRERIA

    if (!categoriasValidas.includes(producto.categoria)) {
      errores.categoria = `La categoría no corresponde a la sección ${producto.seccion}.`
    }
  }

  // Validación de descripción
  if (!producto.descripcion || !producto.descripcion.trim()) {
    errores.descripcion = "La descripción es obligatoria."
  }

  // Validación de imagen
  if (!producto.imagen || !producto.imagen.trim()) {
    errores.imagen = "La ruta o URL de la imagen es obligatoria."
  }

  // Validaciones exclusivas de Imprenta
  if (producto.seccion === "imprenta") {
    if (producto.gramos === undefined || producto.gramos === null || producto.gramos === "") {
      errores.gramos = "El gramaje es obligatorio para productos de imprenta."
    } else {
      const gramosNum = Number(producto.gramos)
      if (isNaN(gramosNum) || gramosNum <= 0) {
        errores.gramos = "El gramaje debe ser un valor numérico positivo."
      }
    }

    if (!producto.tipoHoja || !producto.tipoHoja.trim()) {
      errores.tipoHoja = "El tipo de hoja es obligatorio para productos de imprenta."
    }
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores
  }
}

export default validarProducto
