import Item from "./Item"

function ItemLista({ productos = [] }) {
  if (!productos || productos.length === 0) {
    return (
      <div className="listaVacia">
        <p>No hay productos para mostrar en este momento.</p>
      </div>
    )
  }

  return (
    <section className="grillaProductos">
      {productos.map((producto) => (
        <Item
          key={producto.id}
          producto={producto}
        />
      ))}
    </section>
  )
}

export default ItemLista