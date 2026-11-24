import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

function Registro() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const { registrarUsuario } = useAuth()
  const navigate = useNavigate()

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password || !confirmarPassword) {
      setError("Por favor completa todos los campos requeridos.")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    try {
      setCargando(true)
      await registrarUsuario(email.trim(), password)
      navigate("/")
    } catch (err) {
      let mensaje = "Error al registrar la cuenta."
      if (err.code === "auth/email-already-in-use") {
        mensaje = "Ya existe una cuenta con este correo electrónico."
      } else if (err.code === "auth/invalid-email") {
        mensaje = "El correo electrónico no es válido."
      } else if (err.code === "auth/weak-password") {
        mensaje = "La contraseña es demasiado débil."
      } else if (err.message) {
        mensaje = err.message
      }
      setError(mensaje)
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="contenedorAuth">
      <div className="tarjetaAuth">
        <h2>Crear Cuenta</h2>
        <p className="subtituloAuth">Únete a Na-Ni-Nu y gestiona tus pedidos</p>

        {error && <div className="alertaErrorAuth">{error}</div>}

        <form onSubmit={manejarEnvio} className="formularioAuth">
          <div className="grupoFormulario">
            <label htmlFor="registro-email">Correo Electrónico</label>
            <input
              id="registro-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="grupoFormulario">
            <label htmlFor="registro-password">Contraseña (mínimo 6 caracteres)</label>
            <input
              id="registro-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="grupoFormulario">
            <label htmlFor="registro-confirmar">Confirmar Contraseña</label>
            <input
              id="registro-confirmar"
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="botonPrimario botonAuth"
            disabled={cargando}
          >
            {cargando ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="pieAuth">
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Registro
