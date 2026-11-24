import { useContext } from "react"
import BusquedaContexto from "../contexto/BusquedaContexto"

export function useBusqueda() {
  const contexto = useContext(BusquedaContexto)

  if (!contexto) {
    throw new Error("useBusqueda debe ser utilizado dentro de un BusquedaProveedor")
  }

  return contexto
}

export default useBusqueda
