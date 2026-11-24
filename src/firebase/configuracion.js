import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Verificación de configuración válida
export const estaConfiguradoFirebase = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "tu_api_key_aqui" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "tu_proyecto_id"
)

let app = null
let db = null
let auth = null

if (estaConfiguradoFirebase) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (error) {
    console.error("Error al inicializar Firebase:", error)
  }
} else {
  console.info(
    "[Na-Ni-Nu] Firebase aún no está configurado con credenciales válidas. La aplicación correrá en modo desarrollo local seguro."
  )
}

export { app, db, auth }
