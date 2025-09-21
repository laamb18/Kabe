import { useState } from 'react';
import '../../styles/components/common/ContactSection.css';

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
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'WhatsApp', icon: '💬', url: '#' },
    { name: 'Email', icon: '📧', url: '#' }
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
                    <span className="social-icon">{social.icon}</span>
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