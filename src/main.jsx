import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import AuthProveedor from "./contexto/AuthProveedor.jsx"
import CarritoProveedor from "./contexto/CarritoProveedor.jsx"
import BusquedaProveedor from "./contexto/BusquedaProveedor.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProveedor>
        <CarritoProveedor>
          <BusquedaProveedor>
            <App />
          </BusquedaProveedor>
        </CarritoProveedor>
      </AuthProveedor>
    </BrowserRouter>
  </StrictMode>
)