import { useNavigate } from 'react-router-dom';
import '../../styles/components/common/PackageCard.css';

const PackageCard = ({ packageInfo, onClick }) => {
  const navigate = useNavigate();
  const { id, name, imageUrl, shortDescription, price, discount, capacity, code } = packageInfo;

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const handleExplorar = (e) => {
    e.stopPropagation(); // Prevenir que se active el click del card
    navigate(`/paquetes/${id}`);
  };

  const handleVerProductos = (e) => {
    e.stopPropagation(); // Prevenir que se active el click del card
    navigate('/productos');
  };

  // Calcular precio con descuento si existe
  const finalPrice = discount ? price * (1 - discount / 100) : price;
  const hasDiscount = discount && discount > 0;

  // Función para manejar la imagen de respaldo
  const getImageStyle = () => {
    return {
      backgroundImage: `url(${imageUrl || '/images/package-default.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  };

  return (
    <div 
      className="package-card" 
      data-id={id}
      onClick={handleCardClick}
    >
      <div 
        className="package-card-image"
        style={getImageStyle()}
      />
      
      <div className="package-card-content">
        <span className="package-card-category">PAQUETE</span>
        <h3 className="package-card-name">{name}</h3>
        <p className="package-card-description">{shortDescription}</p>
        
        {code && (
          <div className="package-card-code">
            <span className="package-code-label">Código: {code}</span>
          </div>
        )}
        
        <div className="package-card-footer">
          <div className="package-card-pricing">
            {hasDiscount && (
              <span className="package-card-original-price">${price}/día</span>
            )}
            <span className="package-card-price">
              ${finalPrice.toFixed(2)}/día
            </span>
            {hasDiscount && (
              <span className="package-card-discount">{discount}% OFF</span>
            )}
          </div>
          
          {capacity && (
            <div className="package-card-info">
              <span className="package-card-capacity">
                👥 {capacity} personas
              </span>
            </div>
          )}
        </div>
        
        <div className="package-card-actions">
          <button 
            className="package-card-btn primary"
            onClick={handleExplorar}
          >
            EXPLORAR
          </button>
          <button 
            className="package-card-btn secondary"
            onClick={handleVerProductos}
          >
            VER PRODUCTOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;