function ListaProductosAdmin({ productos = [], onEditar, onEliminar, cargando = false }) {
  if (cargando) {
    return (
      <div className="cargandoAdmin">
        <p>Cargando productos de Firestore...</p>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="vacioAdmin">
        <p>No hay productos registrados en el catálogo.</p>
      </div>
    )
  }

  return (
    <div className="tablaAdminContenedor">
      <table className="tablaAdmin">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Sección</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td className="celdaImagenAdmin">
                {producto.imagen ? (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="miniaturaAdmin"
                  />
                ) : (
                  <div className="miniaturaPlaceholder">Sin img</div>
                )}
              </td>
              <td className="celdaNombreAdmin">
                <strong>{producto.nombre}</strong>
                <span className="idProductoAdmin">ID: {producto.id}</span>
              </td>
              <td>
                <span className={`badgeAdminSeccion ${producto.seccion}`}>
                  {producto.seccion}
                </span>
              </td>
              <td>{producto.categoria}</td>
              <td className="celdaPrecioAdmin">${producto.precio}</td>
              <td className="celdaDetallesAdmin">
                {producto.gramos && <span>{producto.gramos}g</span>}
                {producto.tipoHoja && producto.tipoHoja !== "-" && (
                  <span> / {producto.tipoHoja}</span>
                )}
                {!producto.gramos && !producto.tipoHoja && <span>-</span>}
              </td>
              <td className="celdaAccionesAdmin">
                <button
                  type="button"
                  className="botonAccionEditar"
                  onClick={() => onEditar(producto)}
                  title="Editar producto"
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  className="botonAccionEliminar"
                  onClick={() => onEliminar(producto)}
                  title="Eliminar producto"
                >
                  🗑️ Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaProductosAdmin
