import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore"
import { db, estaConfiguradoFirebase } from "../firebase/configuracion"

const COLECCION_PRODUCTOS = "productos"

/**
 * Obtiene todos los productos del catálogo directamente desde Cloud Firestore.
 */
export async function obtenerProductos() {
  if (!estaConfiguradoFirebase || !db) {
    throw new Error("Firebase no está configurado. Revisa las variables en el archivo .env.")
  }

  try {
    const coleccionRef = collection(db, COLECCION_PRODUCTOS)
    const snapshot = await getDocs(coleccionRef)

    return snapshot.docs.map((docSnap) => ({
      ...docSnap.data(),
      id: docSnap.id
    }))
  } catch (error) {
    console.error("Error al obtener productos desde Firestore:", error)
    throw new Error("No se pudieron cargar los productos desde Cloud Firestore.", { cause: error })
  }
}

/**
 * Obtiene productos filtrados por sección (libreria / imprenta) directamente desde Cloud Firestore.
 */
export async function obtenerProductosPorSeccion(seccion) {
  if (!seccion) {
    return obtenerProductos()
  }

  if (!estaConfiguradoFirebase || !db) {
    throw new Error("Firebase no está configurado. Revisa las variables en el archivo .env.")
  }

  try {
    const coleccionRef = collection(db, COLECCION_PRODUCTOS)
    const consulta = query(coleccionRef, where("seccion", "==", seccion))
    const snapshot = await getDocs(consulta)

    return snapshot.docs.map((docSnap) => ({
      ...docSnap.data(),
      id: docSnap.id
    }))
  } catch (error) {
    console.error(`Error al obtener sección ${seccion} desde Firestore:`, error)
    throw new Error(`No se pudieron cargar los productos de la sección ${seccion} desde Cloud Firestore.`, { cause: error })
  }
}

/**
 * Obtiene un producto individual por su ID de documento en Cloud Firestore.
 */
export async function obtenerProductoPorId(id) {
  if (!id) {
    return null
  }

  if (!estaConfiguradoFirebase || !db) {
    throw new Error("Firebase no está configurado. Revisa las variables en el archivo .env.")
  }

  const idString = String(id)

  try {
    const docRef = doc(db, COLECCION_PRODUCTOS, idString)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    return {
      ...docSnap.data(),
      id: docSnap.id
    }
  } catch (error) {
    console.error(`Error al obtener producto ${idString} desde Firestore:`, error)
    throw new Error("Error al consultar el producto en Cloud Firestore.", { cause: error })
  }
}

/**
 * Crea un nuevo producto en Firestore (requiere autorización de administrador).
 */
export async function crearProducto(datosProducto) {
  if (!estaConfiguradoFirebase || !db) {
    throw new Error("Firebase no está configurado. No se puede crear el producto.")
  }

  try {
    const coleccionRef = collection(db, COLECCION_PRODUCTOS)
    const docRef = await addDoc(coleccionRef, datosProducto)

    return {
      ...datosProducto,
      id: docRef.id
    }
  } catch (error) {
    console.error("Error al crear producto en Firestore:", error)
    throw new Error("No se pudo guardar el producto en Firestore. Verifica los permisos de administrador.", { cause: error })
  }
}

/**
 * Actualiza un producto existente en Firestore (requiere autorización de administrador).
 */
export async function actualizarProducto(id, datosProducto) {
  if (!estaConfiguradoFirebase || !db) {
    throw new Error("Firebase no está configurado. No se puede actualizar el producto.")
  }

  try {
    const idString = String(id)
    const docRef = doc(db, COLECCION_PRODUCTOS, idString)

    const datosParaGuardar = { ...datosProducto }
    delete datosParaGuardar.id
    await updateDoc(docRef, datosParaGuardar)

    return {
      ...datosProducto,
      id: idString
    }
  } catch (error) {
    console.error(`Error al actualizar producto ${id}:`, error)
    throw new Error("No se pudo actualizar el producto en Firestore. Verifica los permisos de administrador.", { cause: error })
  }
}

/**
 * Elimina un producto en Firestore (requiere autorización de administrador).
 */
export async function eliminarProducto(id) {
  if (!estaConfiguradoFirebase || !db) {
    throw new Error("Firebase no está configurado. No se puede eliminar el producto.")
  }

  try {
    const idString = String(id)
    const docRef = doc(db, COLECCION_PRODUCTOS, idString)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error(`Error al eliminar producto ${id}:`, error)
    throw new Error("No se pudo eliminar el producto de Firestore. Verifica los permisos de administrador.", { cause: error })
  }
}
