import { useState } from "react"
import BusquedaContexto from "./BusquedaContexto"

export function BusquedaProveedor({ children }) {
  const [termino, setTermino] = useState("")

  const limpiarBusqueda = () => {
    setTermino("")
  }

  return (
    <BusquedaContexto.Provider
      value={{
        termino,
        setTermino,
        limpiarBusqueda
      }}
    >
      {children}
    </BusquedaContexto.Provider>
  )
}

export default BusquedaProveedor
