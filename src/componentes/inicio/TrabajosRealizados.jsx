import { useEffect, useState } from "react"
import CarruselTrabajos from "./CarruselTrabajos"

function TrabajosRealizados() {
  const [trabajos, setTrabajos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("/data/trabajos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los trabajos")
        }

        return respuesta.json()
      })
      .then((datos) => {
        setTrabajos(datos)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  if (cargando) {
    return <p>Cargando trabajos...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (trabajos.length === 0) {
    return null
  }

  return (
    <section className="trabajosRealizados">
      <h2>Trabajos realizados</h2>

      <CarruselTrabajos trabajos={trabajos} />
    </section>
  )
}

export default TrabajosRealizados