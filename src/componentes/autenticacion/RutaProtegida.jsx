import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export function RutaProtegida({ children, requiereAdmin = false }) {
  const { usuario, esAdmin, cargando } = useAuth()
  const location = useLocation()

  if (cargando) {
    return (
      <div className="contenedorCargandoProtegida">
        <p>Verificando permisos y sesión...</p>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requiereAdmin && !esAdmin) {
    return (
      <section className="accesoDenegado">
        <h2>Acceso Restringido</h2>
        <p>No tienes permisos de administrador para acceder a este panel.</p>
      </section>
    )
  }

  return children
}

export default RutaProtegida
