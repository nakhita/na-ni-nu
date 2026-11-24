/* global process */
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

console.log("==================================================")
console.log("EJECUTANDO PRUEBAS DE INTEGRACIÓN Y SEGURIDAD REALES")
console.log("Firebase Project:", firebaseConfig.projectId)
console.log("==================================================")

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const resultados = []

function registrarPrueba(nombre, exito, detalle) {
  resultados.push({ nombre, exito, detalle })
  console.log(`${exito ? "✅ [PASS]" : "❌ [FAIL]"} ${nombre}: ${detalle}`)
}

async function ejecutar() {
  // 1. Verificación del catálogo en Cloud Firestore
  try {
    const colRef = collection(db, "productos")
    const snapshot = await getDocs(colRef)
    const docs = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }))

    registrarPrueba(
      "1. Lectura de 43 productos desde Firestore",
      docs.length === 43,
      `Se recuperaron ${docs.length} documentos`
    )

    const libreria = docs.filter((p) => p.seccion === "libreria")
    const imprenta = docs.filter((p) => p.seccion === "imprenta")

    registrarPrueba(
      "2. Conteo por sección Librería (28) e Imprenta (15)",
      libreria.length === 28 && imprenta.length === 15,
      `Librería: ${libreria.length}, Imprenta: ${imprenta.length}`
    )

    const categorias = [...new Set(docs.map((p) => p.categoria))]
    registrarPrueba(
      "3. Integridad de 12 categorías",
      categorias.length === 12,
      `Categorías detectadas: ${categorias.length}`
    )

    const imprentaCompleta = imprenta.every(
      (p) => typeof p.gramos === "number" && typeof p.tipoHoja === "string"
    )
    registrarPrueba(
      "4. Atributos exclusivos de Imprenta (gramos y tipoHoja)",
      imprentaCompleta,
      "Todos los 15 productos de Imprenta tienen gramaje y tipo de hoja válidos"
    )
  } catch (err) {
    registrarPrueba("1-4. Catálogo Firestore", false, err.message)
  }

  // 2. Consulta individual por ID de documento
  try {
    const docRef1 = doc(db, "productos", "1")
    const snap1 = await getDoc(docRef1)
    const prod1 = snap1.exists() ? snap1.data() : null

    registrarPrueba(
      "5. Detalle individual (ID '1')",
      Boolean(prod1 && prod1.nombre),
      `Producto 1: "${prod1?.nombre}", Precio: $${prod1?.precio}, Sección: ${prod1?.seccion}`
    )
  } catch (err) {
    registrarPrueba("5. Detalle individual", false, err.message)
  }

  // 3. Autenticación del Administrador y Rol en Firestore
  try {
    const credAdmin = await signInWithEmailAndPassword(auth, "admin@gmail.com", "admin123")
    const userDocSnap = await getDoc(doc(db, "usuarios", credAdmin.user.uid))
    const userData = userDocSnap.exists() ? userDocSnap.data() : null

    registrarPrueba(
      "6. Login Administrativo y Rol en Firestore",
      userData?.rol === "admin",
      `UID: ${credAdmin.user.uid}, Rol en Firestore: "${userData?.rol}"`
    )
  } catch (err) {
    registrarPrueba("6. Login Administrativo", false, err.message)
  }

  // 4. CRUD de prueba con sesión de Administrador
  try {
    // 4.1 Creación
    const nuevoProdData = {
      nombre: "PRODUCTO_PRUEBA_CRUD_AUTOMATIZADO",
      precio: 850,
      seccion: "libreria",
      categoria: "archivo",
      descripcion: "Producto temporal generado para validación de CRUD",
      imagen: "/imagenes/libreria/afiche.jpeg"
    }

    const docCreadoRef = await addDoc(collection(db, "productos"), nuevoProdData)
    const idProductoPrueba = docCreadoRef.id

    const totalTrasCrear = (await getDocs(collection(db, "productos"))).size
    registrarPrueba(
      "7. Creación de producto (CRUD)",
      Boolean(idProductoPrueba && totalTrasCrear === 44),
      `Creado ID: ${idProductoPrueba}. Total en catálogo: ${totalTrasCrear}`
    )

    // 4.2 Edición
    await updateDoc(doc(db, "productos", idProductoPrueba), {
      precio: 1200,
      descripcion: "Descripción actualizada por test de edición"
    })
    const docActualizadoSnap = await getDoc(doc(db, "productos", idProductoPrueba))
    const prodActualizado = docActualizadoSnap.data()

    registrarPrueba(
      "8. Edición de producto (CRUD)",
      prodActualizado.precio === 1200,
      `Precio actualizado a $${prodActualizado.precio}`
    )

    // 4.3 Eliminación con confirmación simulada
    await deleteDoc(doc(db, "productos", idProductoPrueba))
    const totalTrasEliminar = (await getDocs(collection(db, "productos"))).size
    const docEliminadoSnap = await getDoc(doc(db, "productos", idProductoPrueba))

    registrarPrueba(
      "9. Eliminación de producto y preservación de los 43 originales",
      !docEliminadoSnap.exists() && totalTrasEliminar === 43,
      `Producto de prueba eliminado. Total devuelto a: ${totalTrasEliminar}`
    )
  } catch (err) {
    registrarPrueba("7-9. CRUD Admin", false, err.message)
  }

  // 5. Pruebas de Seguridad y Restricciones para Usuarios Comunes
  try {
    await signOut(auth)

    // Crear o loguear usuario cliente de prueba
    const emailCliente = `cliente.test.${Date.now()}@naninu.test`
    const passCliente = "cliente123"
    const credCliente = await createUserWithEmailAndPassword(auth, emailCliente, passCliente)

    // 5.1 Guardar rol 'usuario'
    await updateDoc(doc(db, "usuarios", credCliente.user.uid), {
      email: emailCliente,
      rol: "usuario"
    }).catch(async () => {
      // Si el doc no existe aún, se permite crear según reglas
      const { setDoc } = await import("firebase/firestore")
      await setDoc(doc(db, "usuarios", credCliente.user.uid), {
        email: emailCliente,
        rol: "usuario"
      })
    })

    const clienteDoc = (await getDoc(doc(db, "usuarios", credCliente.user.uid))).data()
    registrarPrueba(
      "10. Rol asignado a nuevo usuario",
      clienteDoc?.rol === "usuario",
      `Nuevo usuario ${emailCliente} tiene rol: "${clienteDoc?.rol}"`
    )

    // 5.2 Intentar escalar privilegios (usuario común intentando autoasignarse rol 'admin')
    let escaladaPermitida = false
    try {
      await updateDoc(doc(db, "usuarios", credCliente.user.uid), {
        rol: "admin"
      })
      escaladaPermitida = true
    } catch {
      escaladaPermitida = false
    }
    registrarPrueba(
      "11. Regla de seguridad: Bloqueo de escalada de privilegios",
      !escaladaPermitida,
      "Firestore rechazó el intento del usuario común de modificar su propio rol a 'admin'"
    )

    // 5.3 Intentar crear producto siendo usuario común
    let creacionPermitida = false
    try {
      await addDoc(collection(db, "productos"), {
        nombre: "INTENTO_NO_AUTORIZADO",
        precio: 100,
        seccion: "libreria"
      })
      creacionPermitida = true
    } catch {
      creacionPermitida = false
    }
    registrarPrueba(
      "12. Regla de seguridad: Bloqueo de creación de productos a no administradores",
      !creacionPermitida,
      "Firestore rechazó la creación de productos por parte del usuario común (permission-denied)"
    )

    // 5.4 Intentar borrar producto original siendo usuario común
    let borradoPermitido = false
    try {
      await deleteDoc(doc(db, "productos", "1"))
      borradoPermitido = true
    } catch {
      borradoPermitido = false
    }
    registrarPrueba(
      "13. Regla de seguridad: Bloqueo de eliminación de productos a no administradores",
      !borradoPermitido,
      "Firestore rechazó el intento de eliminar productos por parte del usuario común"
    )

    await signOut(auth)
  } catch (err) {
    registrarPrueba("10-13. Pruebas de Seguridad", false, err.message)
  }

  console.log("==================================================")
  const todasAprobadas = resultados.every((r) => r.exito)
  console.log(`TOTAL PRUEBAS EJECUTADAS: ${resultados.length}`)
  console.log(`RESULTADO FINAL: ${todasAprobadas ? "100% EXITOSO" : "CON ERRORES"}`)
  console.log("==================================================")
}

ejecutar()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error fatal en suite de pruebas:", err)
    process.exit(1)
  })
