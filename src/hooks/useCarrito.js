import { useContext } from "react"
import CarritoContexto from "../contexto/CarritoContexto"

export function useCarrito() {
  const contexto = useContext(CarritoContexto)

  if (!contexto) {
    throw new Error("useCarrito debe ser utilizado dentro de un CarritoProveedor")
  }

  return contexto
}

export default useCarrito
