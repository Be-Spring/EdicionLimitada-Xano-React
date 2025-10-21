export const CardBase = ({ image, title, subtitle, onClick, children }) => {
  return (
    <div className="product-card-zoom">
      <div className="product-image-container">
        <img
          src={image}
          alt={title}
          className="product-image w-100"
          onClick={onClick}
          style={{ cursor: onClick ? "pointer" : "default" }}
        />
      </div>
      <div className="p-3">
        <h5 className="mb-2">{title}</h5>
        {subtitle && <p className="text-muted mb-2">{subtitle}</p>}
        {children /* aquí puedes inyectar precio, botones, etc. */}
      </div>
    </div>
  );
};
