import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destino = location.state?.from?.pathname || "/"

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.")
      return
    }

    try {
      setCargando(true)
      const resultado = await iniciarSesion(email.trim(), password)
      if (resultado.rol === "admin") {
        navigate("/admin")
      } else {
        navigate(destino)
      }
    } catch (err) {
      let mensaje = "Error al iniciar sesión."
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        mensaje = "Correo electrónico o contraseña incorrectos."
      } else if (err.code === "auth/user-not-found") {
        mensaje = "No se encontró ningún usuario con este correo."
      } else if (err.code === "auth/too-many-requests") {
        mensaje = "Demasiados intentos fallidos. Intenta nuevamente más tarde."
      } else if (err.message) {
        mensaje = err.message
      }
      setError(mensaje)
    } finally {
      setCargando(false)
    }
  }

  const autocompletarAdmin = () => {
    setEmail("admin@gmail.com")
    setPassword("admin123")
  }

  return (
    <section className="contenedorAuth">
      <div className="tarjetaAuth">
        <h2>Iniciar Sesión</h2>
        <p className="subtituloAuth">Ingresa con tu cuenta de Na-Ni-Nu</p>

        {error && <div className="alertaErrorAuth">{error}</div>}

        <form onSubmit={manejarEnvio} className="formularioAuth">
          <div className="grupoFormulario">
            <label htmlFor="login-email">Correo Electrónico</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="grupoFormulario">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="botonPrimario botonAuth"
            disabled={cargando}
          >
            {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="credencialesAcademicas">
          <p><strong>Acceso Académico:</strong></p>
          <code>admin@gmail.com | admin123</code>
          <button
            type="button"
            className="botonAutocompletar"
            onClick={autocompletarAdmin}
          >
            Cargar credenciales de admin
          </button>
        </div>

        <div className="pieAuth">
          <p>
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login
