import ProductCard from "./ProductCard.jsx";
import "./ProductGrid.css";

/** Recibe: products: array
 * Renderiza la grilla con Bootstrap (row/cols) y ProductCard
 */
export default function ProductGrid({ products = [] }) {
  return (
    <section className="products-grid py-5 mt-5">
      <div className="container">
        <div className="row g-4">
          {products.length === 0 ? (
            <div className="col-12 text-center text-muted">Sin productos para mostrar.</div>
          ) : (
            products.map((p) => <ProductCard key={p.id ?? p.nombre_producto} product={p} />)
          )}
        </div>
      </div>
    </section>
  );
}
