import { doc, getDoc, setDoc } from "firebase/firestore"
import { db, estaConfiguradoFirebase } from "../firebase/configuracion"

const COLECCION_USUARIOS = "usuarios"

/**
 * Obtiene el rol de un usuario desde Firestore mediante su UID.
 * La autorización se determina estrictamente por el rol almacenado en Firestore.
 */
export async function obtenerRolUsuario(uid) {
  if (!estaConfiguradoFirebase || !db || !uid) {
    return "usuario"
  }

  try {
    const docRef = doc(db, COLECCION_USUARIOS, uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return data.rol || "usuario"
    }

    return "usuario"
  } catch (error) {
    console.error("Error al consultar rol del usuario en Firestore:", error)
    return "usuario"
  }
}

/**
 * Registra el perfil del nuevo usuario en Firestore.
 * Todo nuevo usuario registrado por el formulario tiene estrictamente el rol 'usuario'.
 */
export async function guardarPerfilUsuario(uid, datos) {
  if (!estaConfiguradoFirebase || !db || !uid) {
    return
  }

  try {
    const docRef = doc(db, COLECCION_USUARIOS, uid)
    // Se asegura que el rol sea siempre "usuario" en el registro
    const perfilLimpio = {
      email: datos.email,
      rol: "usuario",
      creadoEn: datos.creadoEn || new Date().toISOString()
    }
    await setDoc(docRef, perfilLimpio)
  } catch (error) {
    console.error("Error al guardar perfil de usuario en Firestore:", error)
    throw new Error("No se pudo guardar el perfil del usuario en Firestore.", { cause: error })
  }
}
