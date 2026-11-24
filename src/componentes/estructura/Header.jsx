import { Link } from "react-router-dom"
import Nav from "./Nav"
import Buscador from "../productos/Buscador"

function Header() {
  return (
    <header className="header">
      <div className="headerContenido">

        <Link to="/" className="marca">
          <img
            src="/imagenes/logo/na-ni-nu.png"
            alt="Logo Na-Ni-Nu"
            className="logoMarca"
          />

          <div className="textoMarca">
            <h1>
              <span className="marcaNa">Na</span>
              <span className="marcaGuion">-</span>
              <span className="marcaNi">Ni</span>
              <span className="marcaGuion">-</span>
              <span className="marcaNu">Nu</span>
            </h1>

            <p>
              Todo lo que necesitas en un solo lugar
            </p>
          </div>
        </Link>

        <Buscador />

        <Nav />
      </div>
    </header>
  )
}

export default Header