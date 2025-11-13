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
    product.disenador?.nombre_disenador ||
    "";

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

        <div className="p-3">
          <h5 className="mb-2">{title}</h5>
          {designer && <p className="text-muted mb-2">{designer}</p>}
          <p className="fw-bold mb-0">{formatPriceCLP(price)}</p>
          <div className="mt-3">
            <button className="btn btn-sm btn-light" onClick={handleAddToCart}>Agregar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
