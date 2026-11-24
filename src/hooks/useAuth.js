import { useContext } from "react"
import AuthContexto from "../contexto/AuthContexto"

export function useAuth() {
  const contexto = useContext(AuthContexto)

  if (!contexto) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProveedor")
  }

  return contexto
}

export default useAuth
