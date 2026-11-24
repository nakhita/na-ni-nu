function Paginador({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
  onAnterior,
  onSiguiente
}) {
  if (totalPaginas <= 1) {
    return null
  }

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <nav className="paginadorContenedor" aria-label="Navegación de páginas">
      <button
        type="button"
        className="botonPaginador botonControlPagina"
        onClick={onAnterior}
        disabled={paginaActual === 1}
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      <div className="numerosPaginaContenedor">
        {paginas.map((num) => (
          <button
            key={num}
            type="button"
            className={
              num === paginaActual
                ? "botonPaginador botonPaginaNumero paginaActiva"
                : "botonPaginador botonPaginaNumero"
            }
            onClick={() => onCambiarPagina(num)}
            aria-current={num === paginaActual ? "page" : undefined}
            aria-label={`Ir a la página ${num}`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="botonPaginador botonControlPagina"
        onClick={onSiguiente}
        disabled={paginaActual === totalPaginas}
        aria-label="Página siguiente"
      >
        Siguiente →
      </button>
    </nav>
  )
}

export default Paginador
