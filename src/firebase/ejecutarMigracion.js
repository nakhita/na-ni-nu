/* global process */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  getDocs
} from "firebase/firestore"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

console.log("=== INICIANDO MIGRACIÓN CONTROLADA A FIRESTORE ===")
console.log("Project ID:", firebaseConfig.projectId)

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function migrar() {
  // 1. Autenticación administrativa obligatoria según reglas de seguridad
  console.log("Autenticando administrador académico...")
  const credencial = await signInWithEmailAndPassword(
    auth,
    "admin@gmail.com",
    "admin123"
  )
  console.log("Administrador autenticado con éxito. UID:", credencial.user.uid)

  // 2. Verificar que la colección esté vacía
  const colRef = collection(db, "productos")
  const snapshotInicial = await getDocs(colRef)
  if (!snapshotInicial.empty) {
    throw new Error(
      `Operación abortada: la colección 'productos' ya contiene ${snapshotInicial.size} documentos.`
    )
  }
  console.log("Colección 'productos' verificada: se encuentra completamente vacía.")

  // 3. Cargar y validar JSON original
  const rutaJson = path.resolve(__dirname, "../../public/data/productos.json")
  const contenidoRaw = fs.readFileSync(rutaJson, "utf-8")
  const productosOriginales = JSON.parse(contenidoRaw)

  if (productosOriginales.length !== 43) {
    throw new Error(
      `Cantidad inválida de productos: ${productosOriginales.length} (se requerían exactamente 43).`
    )
  }

  const idsUnicos = new Set(productosOriginales.map((p) => String(p.id)))
  if (idsUnicos.size !== 43) {
    throw new Error("Existen identificadores duplicados en el JSON original.")
  }

  console.log(`Validado productos.json: 43 productos únicos listos para migración.`)

  // 4. Preparar Batch Write
  const batch = writeBatch(db)

  productosOriginales.forEach((prod) => {
    const idDoc = String(prod.id)
    const docRef = doc(db, "productos", idDoc)

    const datosDoc = {
      nombre: prod.nombre.trim(),
      precio: Number(prod.precio),
      seccion: prod.seccion,
      categoria: prod.categoria,
      descripcion: prod.descripcion.trim(),
      imagen: prod.imagen.trim()
    }

    if (prod.seccion === "imprenta") {
      datosDoc.gramos = Number(prod.gramos)
      datosDoc.tipoHoja = String(prod.tipoHoja).trim()
    }

    batch.set(docRef, datosDoc)
  })

  console.log("Enviando lote de 43 documentos a Cloud Firestore...")
  await batch.commit()
  console.log("¡Lote confirmado exitosamente en Firestore!")

  // 5. Verificación post-migración
  const snapshotFinal = await getDocs(colRef)
  console.log(`Documentos totales en Firestore tras migración: ${snapshotFinal.size}`)

  const docs = snapshotFinal.docs.map((d) => ({ id: d.id, ...d.data() }))
  const libreria = docs.filter((p) => p.seccion === "libreria")
  const imprenta = docs.filter((p) => p.seccion === "imprenta")
  const categorias = [...new Set(docs.map((p) => p.categoria))]

  console.log(`- Librería: ${libreria.length} (esperados: 28)`)
  console.log(`- Imprenta: ${imprenta.length} (esperados: 15)`)
  console.log(`- Categorías: ${categorias.length} (esperadas: 12)`)
  console.log("Categorías:", categorias)

  const imprentaConGramos = imprenta.filter((p) => p.gramos !== undefined && p.tipoHoja !== undefined)
  console.log(`- Imprenta con gramaje y tipo de hoja: ${imprentaConGramos.length} (esperados: 15)`)

  console.log("=== MIGRACIÓN FINALIZADA CON ÉXITO ===")
}

migrar()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Fallo durante la migración:", err)
    process.exit(1)
  })
