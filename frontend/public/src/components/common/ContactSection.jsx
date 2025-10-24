import { useState } from 'react';
import '../../styles/components/common/ContactSection.css';

const SocialIcon = ({ icon, color }) => {
  const icons = {
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    whatsapp: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
      </svg>
    ),
    email: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.82L12 10.09l9.545-6.269h.82c.904 0 1.636.732 1.636 1.636z"/>
      </svg>
    )
  };

  return (
    <div className="social-icon-wrapper" style={{ '--icon-color': color }}>
      {icons[icon]}
    </div>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    products: [],
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      products: checked 
        ? [...prev.products, value]
        : prev.products.filter(product => product !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implementar lógica de envío
    console.log('Datos del formulario:', formData);
    alert('¡Gracias por tu cotización! Te contactaremos pronto.');
  };

  const productOptions = [
    'Sillas',
    'Mesas',
    'Manteles',
    'Decoración',
    'Iluminación',
    'Audio',
    'Carpas',
    'Vajilla'
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: '#', color: '#1877F2' },
    { name: 'Instagram', icon: 'instagram', url: '#', color: '#E4405F' },
    { name: 'WhatsApp', icon: 'whatsapp', url: '#', color: '#25D366' },
    { name: 'Email', icon: 'email', url: '#', color: '#EA4335' }
  ];

  return (
    <section className="contact-section" id="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Solicita tu Cotización</h2>
          <p className="contact-subtitle">
            Cuéntanos sobre tu evento y te ayudaremos a crear la experiencia perfecta
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              {/* Información personal */}
              <div className="form-section">
                <h3 className="form-section-title">Información de Contacto</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Información del evento */}
              <div className="form-section">
                <h3 className="form-section-title">Detalles del Evento</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="eventType">Tipo de evento *</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona el tipo</option>
                      <option value="boda">Boda</option>
                      <option value="cumpleanos">Cumpleaños</option>
                      <option value="corporativo">Evento Corporativo</option>
                      <option value="graduacion">Graduación</option>
                      <option value="quinceanos">XV Años</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventDate">Fecha del evento *</label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="guestCount">Número de invitados *</label>
                  <select
                    id="guestCount"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona el rango</option>
                    <option value="1-25">1 - 25 personas</option>
                    <option value="26-50">26 - 50 personas</option>
                    <option value="51-100">51 - 100 personas</option>
                    <option value="101-200">101 - 200 personas</option>
                    <option value="200+">Más de 200 personas</option>
                  </select>
                </div>
              </div>

              {/* Productos necesarios */}
              <div className="form-section">
                <h3 className="form-section-title">Productos que necesitas</h3>
                <div className="checkbox-grid">
                  {productOptions.map((product) => (
                    <label key={product} className="checkbox-item">
                      <input
                        type="checkbox"
                        value={product}
                        checked={formData.products.includes(product)}
                        onChange={handleProductChange}
                      />
                      <span className="checkbox-custom"></span>
                      {product}
                    </label>
                  ))}
                </div>
              </div>

              {/* Mensaje adicional */}
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="message">Detalles adicionales</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Cuéntanos más detalles sobre tu evento, ubicación, horario, etc."
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Solicitar Cotización
                </button>
              </div>
            </form>
          </div>

          {/* Información de contacto y redes sociales */}
          <div className="contact-info">
            <div className="contact-info-card">
              <h3>¿Prefieres contactarnos directamente?</h3>
              <div className="contact-methods">
                <div className="contact-method">
                  <span className="method-icon">📞</span>
                  <div>
                    <strong>Teléfono</strong>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="method-icon">📧</span>
                  <div>
                    <strong>Email</strong>
                    <p>info@kabe.com</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="method-icon">📍</span>
                  <div>
                    <strong>Ubicación</strong>
                    <p>Ciudad, Estado</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="social-section">
              <h3>Síguenos en redes sociales</h3>
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="social-link"
                    title={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon icon={social.icon} color={social.color} />
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;