import '../../styles/components/common/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Paquetes', href: '/paquetes' },
    { name: 'Productos', href: '/productos' },
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' }
  ];

  const services = [
    'Renta de Sillas',
    'Renta de Mesas',
    'Decoración',
    'Iluminación',
    'Audio y Sonido',
    'Carpas y Toldos'
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'WhatsApp', icon: '💬', url: '#' },
    { name: 'Email', icon: '📧', url: '#' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <h3>K´abé</h3>
            </div>
            <p className="footer-description">
              Especialistas en renta de mobiliario para eventos. 
              Hacemos realidad tus celebraciones con productos de calidad 
              y servicio excepcional.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>(555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>info@kabe.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Ciudad, Estado, México</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Enlaces Rápidos</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-title">Nuestros Servicios</h4>
            <ul className="footer-links">
              {services.map((service) => (
                <li key={service}>
                  <span className="footer-service">
                    <span className="service-bullet">•</span>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="footer-section">
            <h4 className="footer-title">Síguenos</h4>
            <div className="footer-social">
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
                </a>
              ))}
            </div>
            
            <div className="newsletter">
              <h5 className="newsletter-title">Newsletter</h5>
              <p className="newsletter-text">
                Recibe ofertas especiales y novedades
              </p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>
                © {currentYear} K´abé. Todos los derechos reservados.
              </p>
            </div>
            <div className="footer-legal">
              <a href="#" className="legal-link">Política de Privacidad</a>
              <span className="separator">|</span>
              <a href="#" className="legal-link">Términos de Servicio</a>
              <span className="separator">|</span>
              <a href="#" className="legal-link">Cookies</a>
              <span className="separator">|</span>
              <a href="/admin/login" className="legal-link admin-link" title="Panel de Administración">Admin</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;