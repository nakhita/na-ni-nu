import { collection, doc, writeBatch, getDocs } from "firebase/firestore"
import { db, estaConfiguradoFirebase } from "./configuracion"

/**
 * Mecanismo controlado de migración de los 43 productos originales hacia Cloud Firestore.
 * No se ejecuta de forma automática; requiere invocación explícita cuando el entorno Firebase esté configurado.
 */
export async function migrarProductosAFirestore() {
  if (!estaConfiguradoFirebase || !db) {
    throw new Error(
      "Firebase no está configurado. Conecta un proyecto válido antes de ejecutar la migración."
    )
  }

  // 1. Verificar si ya existen productos en la colección
  const coleccionRef = collection(db, "productos")
  const snapshotExistente = await getDocs(coleccionRef)

  if (!snapshotExistente.empty) {
    return {
      exito: false,
      mensaje: `La colección ya contiene ${snapshotExistente.size} productos. No se sobreescribieron datos.`
    }
  }

  // 2. Leer productos del JSON original
  const respuesta = await fetch("/data/productos.json")
  if (!respuesta.ok) {
    throw new Error("No se pudo leer public/data/productos.json")
  }
  const productos = await respuesta.json()

  if (productos.length !== 43) {
    throw new Error(
      `El archivo JSON tiene ${productos.length} productos (se esperaban exactamente 43).`
    )
  }

  // 3. Escribir en lotes respetando el ID original convertido a string
  const batch = writeBatch(db)

  productos.forEach((producto) => {
    const idDoc = String(producto.id)
    const docRef = doc(db, "productos", idDoc)

    // Payload limpio conservando todos los atributos
    const datos = {
      nombre: producto.nombre,
      precio: Number(producto.precio),
      seccion: producto.seccion,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      imagen: producto.imagen
    }

    if (producto.gramos !== undefined) {
      datos.gramos = Number(producto.gramos)
    }

    if (producto.tipoHoja !== undefined) {
      datos.tipoHoja = String(producto.tipoHoja)
    }

    batch.set(docRef, datos)
  })

  await batch.commit()

  return {
    exito: true,
    totalMigrados: productos.length,
    mensaje: `Se migraron con éxito los ${productos.length} productos a Firestore.`
  }
}
