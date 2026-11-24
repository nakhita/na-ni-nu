import { Routes, Route } from "react-router-dom"

import Layout from "./componentes/estructura/Layout"
import ItemListaContenedor from "./componentes/productos/ItemListaContenedor"
import DetalleProducto from "./componentes/productos/DetalleProducto"
import Carrito from "./componentes/carrito/Carrito"
import TrabajosRealizados from "./componentes/inicio/TrabajosRealizados"
import ComprarHoy from "./componentes/inicio/ComprarHoy"
import Login from "./componentes/autenticacion/Login"
import Registro from "./componentes/autenticacion/Registro"
import RutaProtegida from "./componentes/autenticacion/RutaProtegida"
import PanelAdministracion from "./componentes/administracion/PanelAdministracion"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <>
              <TrabajosRealizados />
              <ComprarHoy />
            </>
          }
        />

        <Route
          path="/productos"
          element={<ItemListaContenedor />}
        />

        <Route
          path="/libreria"
          element={
            <ItemListaContenedor seccion="libreria" />
          }
        />

        <Route
          path="/imprenta"
          element={
            <ItemListaContenedor seccion="imprenta" />
          }
        />

        <Route
          path="/producto/:id"
          element={<DetalleProducto />}
        />

        <Route
          path="/carrito"
          element={<Carrito />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/admin"
          element={
            <RutaProtegida requiereAdmin>
              <PanelAdministracion />
            </RutaProtegida>
          }
        />
      </Route>
    </Routes>
  )
}

export default App