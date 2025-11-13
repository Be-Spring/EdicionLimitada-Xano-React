import React from 'react';
import './Editorial.css';

const Editorial = () => {
  // posts currently empty — replace with real data when available
  const posts = [];

  return (
    <>
      {/* Editorial Header */}
      <section className="py-5 mt-5 bg-dark text-white editorial-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="michroma-regular mb-3">EDITORIAL</h1>
              <p className="lead">Descubre las últimas tendencias, estilos y novedades en el mundo de la moda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post (static placeholder) */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card bg-dark text-white featured-post">
                <img src="/assets/img/editorial/EdicionLimitada-053-scaled.jpg" className="card-img" alt="Tendencias Otoño" />
                <div className="card-img-overlay d-flex flex-column justify-content-end featured-overlay">
                  <h2 className="card-title michroma-regular">Lo distinto nos une, una editorial de Edición Limitada</h2>
                  <p className="card-text">Edición Limitada recopila ideas, creativos y estilos diferentes para plasmar lo que podemos encontrar en ella desde su creación en 2022</p>
                  <p className="card-meta"><small>12 agosto, 2025</small><span className="ms-3">Tendencias</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Grid — structure kept, examples removed */}
      <section className="py-5 bg-light">
        <div className="container">
          <h3 className="michroma-regular mb-4">ÚLTIMAS PUBLICACIONES</h3>
          <div className="row g-4">
            {posts.length === 0 ? (
              <div className="col-12 text-center">
                <p className="text-muted">No hay publicaciones disponibles por el momento. Vuelve pronto.</p>
              </div>
            ) : (
              posts.map((post, idx) => (
                <div className="col-md-4" key={idx}>
                  <article className="card h-100 bg-dark text-white blog-card">
                    <img src={post.image} className="card-img-top" alt={post.title} />
                    <div className="card-body">
                      <span className="blog-category michroma-regular">{post.category}</span>
                      <h4 className="blog-title michroma-regular mt-2">{post.title}</h4>
                      <p className="blog-excerpt mt-3">{post.excerpt}</p>
                    </div>
                    <div className="card-footer bg-transparent border-0"><small className="text-muted">{post.date}</small></div>
                  </article>
                </div>
              ))
            )}
          </div>

          {/* Load more button (kept disabled until there are posts) */}
          <div className="text-center mt-5">
            <button className="btn btn-dark michroma-regular px-4 py-2" disabled={posts.length === 0}>CARGAR MÁS ARTÍCULOS</button>
          </div>
        </div>
      </section>

      {/* Categories grid (kept as visual navigation) */}
      <section className="py-5">
        <div className="container">
          <h3 className="michroma-regular mb-4">CATEGORÍAS</h3>
          <div className="row g-4 categories-grid">
            {['TENDENCIAS','DISEÑADORES','STREETWEAR','ACCESORIOS'].map((cat) => (
              <div className="col-6 col-md-3" key={cat}>
                <div className="card bg-dark text-white category-card">
                  <img src={`https://source.unsplash.com/featured/?fashion,${cat.toLowerCase()}`} className="card-img" alt={cat} />
                  <div className="card-img-overlay d-flex align-items-center justify-content-center category-overlay">
                    <h5 className="card-title michroma-regular mb-0">{cat}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Editorial;
