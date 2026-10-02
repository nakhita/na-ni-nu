import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import CarritoProveedor from "./contexto/CarritoProveedor.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CarritoProveedor>
        <App />
      </CarritoProveedor>
    </BrowserRouter>
  </StrictMode>
)