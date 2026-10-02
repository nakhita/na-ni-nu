import { useEffect, useState } from "react"

function CarruselTrabajos({ trabajos }) {
  const [indiceActual, setIndiceActual] = useState(0)
  const [imagenAmpliada, setImagenAmpliada] = useState(false)

  const trabajoActual = trabajos[indiceActual]

  const titulosCategorias = {
    sticker: "Stickers",
    imanes: "Imanes",
    llavero: "Llaveros",
    separadores: "Separadores",
    rompecabezas: "Rompecabezas",
    cuadernos: "Cuadernos",
    hojas: "Hojas",
    anotador: "Anotador",
    album: "Álbumes",
    folleto: "Folletos",
    impresion: "Impresiones",
    tarjetaPresentacion: "Tarjetas de presentación",
    libro: "Libros"
  }

  const tituloActual =
    titulosCategorias[trabajoActual.categoria] ||
    trabajoActual.categoria

  const anterior = () => {
    setIndiceActual((indiceAnterior) =>
      indiceAnterior === 0
        ? trabajos.length - 1
        : indiceAnterior - 1
    )
  }

  const siguiente = () => {
    setIndiceActual((indiceAnterior) =>
      indiceAnterior === trabajos.length - 1
        ? 0
        : indiceAnterior + 1
    )
  }

  useEffect(() => {
    if (imagenAmpliada || trabajos.length <= 1) {
      return
    }

    const intervalo = setInterval(() => {
      setIndiceActual((indiceAnterior) =>
        indiceAnterior === trabajos.length - 1
          ? 0
          : indiceAnterior + 1
      )
    }, 2000)

    return () => {
      clearInterval(intervalo)
    }
  }, [imagenAmpliada, trabajos.length])

  const cerrarPopup = (evento) => {
    if (evento.target === evento.currentTarget) {
      setImagenAmpliada(false)
    }
  }

  return (
    <>
      <section className="carruselTrabajos">
        <h3>{tituloActual}</h3>

        <div className="carruselContenedor">
          <button
            className="flechaCarrusel flechaIzquierda"
            onClick={anterior}
            aria-label="Trabajo anterior"
          >
            ‹
          </button>

          <button
            className="botonImagenCarrusel"
            onClick={() => setImagenAmpliada(true)}
            aria-label="Ampliar imagen"
          >
            <div className="imagenCarrusel">
              <img
                src={trabajoActual.imagen}
                alt={trabajoActual.titulo}
              />
            </div>
          </button>

          <button
            className="flechaCarrusel flechaDerecha"
            onClick={siguiente}
            aria-label="Trabajo siguiente"
          >
            ›
          </button>
        </div>

        <div className="indicadoresCarrusel">
          {trabajos.map((trabajo, index) => (
            <button
              key={trabajo.id}
              className={
                index === indiceActual
                  ? "indicadorCarrusel indicadorActivo"
                  : "indicadorCarrusel"
              }
              onClick={() => setIndiceActual(index)}
              aria-label={`Ver trabajo ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {imagenAmpliada && (
        <div
          className="popupImagen"
          onClick={cerrarPopup}
        >
          <div className="popupContenido">
            <button
              className="cerrarPopup"
              onClick={() => setImagenAmpliada(false)}
              aria-label="Cerrar imagen"
            >
              ×
            </button>

            <img
              src={trabajoActual.imagen}
              alt={trabajoActual.titulo}
            />

            <p>{tituloActual}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default CarruselTrabajos