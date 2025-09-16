import '../../styles/components/common/AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-content">
          {/* Imagen lado izquierdo */}
          <div className="about-image">
            <div className="about-image-placeholder">
              <span className="image-placeholder-text">Imagen de sillas</span>
            </div>
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
                  <div className="feature-icon">✓</div>
                  <span>Servicio puntual y confiable</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span>Productos en excelente estado</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
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