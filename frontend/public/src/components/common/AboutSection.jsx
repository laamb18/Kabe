import '../../styles/components/common/AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section" id="about-section">
      <div className="about-container">
        <div className="about-content">
          {/* Imagen lado izquierdo */}
          <div className="about-image">
            <img 
              src="/frontend/public/images/mesa-about.jpg"
              alt="Mobiliario de calidad - K'abé Renta de Mobiliario"
              className="about-image-main"
            />
            <div className="about-image-overlay"></div>
          </div>
          
          {/* Contenido lado derecho */}
          <div className="about-text">
            <div className="about-text-content">
              <h2 className="about-title">Sobre Nosotros</h2>
              
              <div className="about-quote">
                <span className="quote-mark">"</span>
                <p className="quote-text">
                  En <strong>K'abé</strong> nos especializamos en la renta de mesas y sillas para todo tipo de eventos. 
                  Nuestro objetivo es brindarte soluciones prácticas y confiables para que tus celebraciones, 
                  reuniones o eventos especiales cuenten siempre con el mobiliario adecuado.
                </p>
              </div>
              
              <div className="about-description">
                <p>
                  Nos caracterizamos por ofrecer un servicio puntual, productos en excelente estado y 
                  atención personalizada para que tu experiencia sea sencilla y sin preocupaciones.
                </p>
              </div>
              
              <div className="about-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span>Servicio puntual y confiable</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span>Productos en excelente estado</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span>Atención personalizada</span>
                </div>
              </div>
              
              <div className="about-actions">
                <button className="about-btn primary">
                  Conoce más
                </button>
                <button className="about-btn secondary">
                  Contáctanos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;