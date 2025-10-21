export const Hero = () => {
  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <a href="productos.html" className="text-decoration-none">
          <div className="carousel-item active">
            <img
              src="https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg"
              className="d-block w-100"
              alt="Productos"
            />
            <div className="carousel-caption">
              <h2 className="michroma-regular fs-3">Productos</h2>
            </div>
          </div>
        </a>

        <a href="disenadores.html" className="text-decoration-none">
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg"
              className="d-block w-100"
              alt="Diseñadores"
            />
            <div className="carousel-caption">
              <h2 className="michroma-regular fs-3">Diseñadores</h2>
            </div>
          </div>
        </a>

        <div className="carousel-item">
          <img
            src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg"
            className="d-block w-100"
            alt="Eventos"
          />
          <div className="carousel-caption">
            <h2 className="michroma-regular fs-3">Eventos</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero