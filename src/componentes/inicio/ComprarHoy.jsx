import { Link } from "react-router-dom"

function ComprarHoy() {
  return (
    <section className="comprarHoy">
      <h2>¿Qué te gustaría comprar el día de hoy?</h2>

      <div className="opcionesCompra">
        <Link
          to="/imprenta"
          className="opcionCompra"
        >
          <span>Imprenta</span>
          <small>
            Impresiones, fotocopias y trabajos personalizados
          </small>
        </Link>

        <Link
          to="/libreria"
          className="opcionCompra"
        >
          <span>Librería</span>
          <small>
            Artículos escolares, papelería y más
          </small>
        </Link>
      </div>
    </section>
  )
}

export default ComprarHoy