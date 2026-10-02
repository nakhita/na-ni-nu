import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

function Layout() {
  return (
    <div className="sitio">
      <Header />

      <main className="contenidoPrincipal">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout