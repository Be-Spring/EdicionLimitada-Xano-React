import ProductImagesSlider from "./ProductImageSlider.jsx";
import "./ProductCard.css";
import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext.jsx";

function formatPriceCLP(n) {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  } catch {
    return "$" + (Number(n) || 0).toLocaleString("es-CL");
  }
}

/** Espera un producto con al menos:
 * {
 *   id, nombre_producto (o name),
 *   valor_producto (o price),
 *   images?: (string[] | {url|path}[]),
 *   disenadorNombre?: string
 * }
 */
export default function ProductCard({ product }) {
  const title = product.nombre_producto ?? product.name ?? "Producto";
  const price = product.valor_producto ?? product.price ?? 0;
  const designer =
    product.disenador_nombre ||
    product.designer ||
    (typeof product.disenador === 'object' ? (product.disenador.nombre_disenador || product.disenador.name) : '') ||
    (product.raw && product.raw.disenador && (product.raw.disenador.nombre_disenador || product.raw.disenador.name)) ||
    '';

  // Normalizamos posibles formatos de imágenes (string url, {url}, {path})
  const normalizedImages = (Array.isArray(product.images) ? product.images : [])
    .map((it) => (typeof it === "string" ? { url: it } : it))
    .map((it) => it?.url || it?.path)
    .filter(Boolean);

  const { addToCart, openCart } = useContext(CartContext);

  const cartProduct = {
    id: product.id ?? product.nombre_producto ?? title,
    name: title,
    price,
    image: normalizedImages[0] || product.imagen || product.image || "",
    designer,
  };

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart(cartProduct, 1);
    // open the cart drawer for feedback
    if (typeof openCart === "function") openCart();
  }

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="product-card-zoom">
        <div className="product-image-container">
          <ProductImagesSlider images={normalizedImages} alt={title} aspect="4/3" />
        </div>

        <div className="p-3 text-center product-card-body">
          <h5 className="mb-2 product-title">{title}</h5>
          {designer && <p className="text-muted mb-2 product-designer">{designer}</p>}
          <p className="fw-bold mb-0 product-price">{formatPriceCLP(price)}</p>
          <div className="d-flex align-items-center justify-content-between mt-3 product-footer">
            <div>
              <button className="btn btn-sm btn-light" onClick={handleAddToCart}>Agregar</button>
            </div>
            <div className="product-stock text-muted">stock: {product.stock ?? product.raw?.stock ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
