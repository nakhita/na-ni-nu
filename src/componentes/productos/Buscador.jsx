import { useNavigate, useLocation } from "react-router-dom"
import { useBusqueda } from "../../hooks/useBusqueda"

function Buscador() {
  const { termino, setTermino, limpiarBusqueda } = useBusqueda()
  const navigate = useNavigate()
  const location = useLocation()

  const manejarCambio = (e) => {
    const nuevoValor = e.target.value
    setTermino(nuevoValor)

    // Si el usuario escribe desde una ruta diferente a catálogo, redirigir a catálogo
    const rutasCatalogo = ["/productos", "/libreria", "/imprenta"]
    if (nuevoValor.trim() && !rutasCatalogo.includes(location.pathname)) {
      navigate("/productos")
    }
  }

  return (
    <div className="buscadorContenedor">
      <div className="buscadorInputEnvoltorio">
        <span className="iconoBuscador">🔍</span>
        <input
          type="search"
          className="inputBuscador"
          value={termino}
          onChange={manejarCambio}
          placeholder="Buscar productos (ej. cuaderno, fotocopia)..."
          aria-label="Buscar productos por nombre"
        />
        {termino && (
          <button
            type="button"
            className="botonLimpiarBuscador"
            onClick={limpiarBusqueda}
            title="Limpiar búsqueda"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default Buscador
