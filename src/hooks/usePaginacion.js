import { useState } from "react"

export function usePaginacion(elementos = [], elementosPorPagina = 12) {
  const [paginaDeseada, setPaginaDeseada] = useState(1)

  const totalPaginas = Math.ceil(elementos.length / elementosPorPagina) || 1
  const paginaActual = Math.max(1, Math.min(paginaDeseada, totalPaginas))

  const inicio = (paginaActual - 1) * elementosPorPagina
  const fin = inicio + elementosPorPagina
  const elementosPaginados = elementos.slice(inicio, fin)

  const irAPagina = (numero) => {
    const num = Math.max(1, Math.min(numero, totalPaginas))
    setPaginaDeseada(num)
    window.scrollTo({ top: 300, behavior: "smooth" })
  }

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      irAPagina(paginaActual + 1)
    }
  }

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      irAPagina(paginaActual - 1)
    }
  }

  return {
    paginaActual,
    totalPaginas,
    elementosPaginados,
    totalElementos: elementos.length,
    irAPagina,
    paginaSiguiente,
    paginaAnterior,
    elementosPorPagina
  }
}

export default usePaginacion
