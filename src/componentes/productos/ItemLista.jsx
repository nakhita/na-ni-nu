import Item from "./Item"

function ItemLista({ productos }) {
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