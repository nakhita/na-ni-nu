import { useEffect, useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth"
import AuthContexto from "./AuthContexto"
import { auth, estaConfiguradoFirebase } from "../firebase/configuracion"
import { obtenerRolUsuario, guardarPerfilUsuario } from "../servicios/usuariosServicio"

export function AuthProveedor({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState(null)
  const [cargando, setCargando] = useState(() => Boolean(estaConfiguradoFirebase && auth))

  useEffect(() => {
    if (!estaConfiguradoFirebase || !auth) {
      return () => {}
    }

    const desuscribir = onAuthStateChanged(auth, async (userFirebase) => {
      if (userFirebase) {
        setUsuario(userFirebase)
        const rolUsuario = await obtenerRolUsuario(userFirebase.uid)
        setRol(rolUsuario)
      } else {
        setUsuario(null)
        setRol(null)
      }
      setCargando(false)
    })

    return () => {
      desuscribir()
    }
  }, [])

  const iniciarSesion = async (email, password) => {
    if (!estaConfiguradoFirebase || !auth) {
      throw new Error(
        "Firebase no está configurado con credenciales válidas. Configura las variables en .env para autenticarte."
      )
    }

    const credenciales = await signInWithEmailAndPassword(auth, email, password)
    const rolUsuario = await obtenerRolUsuario(credenciales.user.uid)
    setUsuario(credenciales.user)
    setRol(rolUsuario)
    return { user: credenciales.user, rol: rolUsuario }
  }

  const registrarUsuario = async (email, password) => {
    if (!estaConfiguradoFirebase || !auth) {
      throw new Error(
        "Firebase no está configurado con credenciales válidas. Configura las variables en .env para registrar usuarios."
      )
    }

    const credenciales = await createUserWithEmailAndPassword(auth, email, password)
    // Todo nuevo usuario registrado por el formulario tiene rol 'usuario'
    await guardarPerfilUsuario(credenciales.user.uid, {
      email,
      rol: "usuario",
      creadoEn: new Date().toISOString()
    })

    setUsuario(credenciales.user)
    setRol("usuario")
    return { user: credenciales.user, rol: "usuario" }
  }

  const cerrarSesion = async () => {
    if (estaConfiguradoFirebase && auth) {
      await signOut(auth)
    }
    setUsuario(null)
    setRol(null)
  }

  // La autorización se determina estrictamente por el rol almacenado en Firestore
  const esAdmin = rol === "admin"

  return (
    <AuthContexto.Provider
      value={{
        usuario,
        rol,
        cargando,
        esAdmin,
        iniciarSesion,
        registrarUsuario,
        cerrarSesion
      }}
    >
      {children}
    </AuthContexto.Provider>
  )
}

export default AuthProveedor
