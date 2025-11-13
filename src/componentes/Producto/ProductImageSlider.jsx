import React, { useState, useMemo } from "react";
import "./ProductImageSlider.css";

export default function ProductImagesSlider({ images = [], alt = "Imagen", aspect = "4/3" }) {
  const urls = useMemo(() => {
    const arr = Array.isArray(images) ? images : [];
    const list = arr.map((it) => (typeof it === "string" ? it : it?.url)).filter(Boolean);
    return list.length > 0 ? list : ["https://placehold.co/600x400?text=Sin+imagen"];
  }, [images]);

  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + urls.length) % urls.length);
  const next = () => setIdx((i) => (i + 1) % urls.length);

  return (
    <div className="pis-root position-relative" style={{ aspectRatio: aspect }}>
      <img src={urls[idx]} alt={alt} className="w-100 h-100" style={{ objectFit: "cover" }} loading="lazy" />
      {urls.length > 1 && (
        <>
          <button type="button" className="btn btn-sm btn-dark pis-nav pis-nav-left" onClick={prev} aria-label="Anterior">‹</button>
          <button type="button" className="btn btn-sm btn-dark pis-nav pis-nav-right" onClick={next} aria-label="Siguiente">›</button>
          <div className="pis-dots position-absolute d-flex gap-1">
            {urls.map((_, i) => (
              <span key={i} className="rounded-circle" style={{ width: 8, height: 8, background: i === idx ? "#000" : "#bbb" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
