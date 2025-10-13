import '../../styles/components/common/PackageCard.css';

const PackageCard = ({ packageInfo, onClick }) => {
  const { id, name, imageUrl, shortDescription, price, discount, capacity, code } = packageInfo;

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  // Calcular precio con descuento si existe
  const finalPrice = discount ? price * (1 - discount / 100) : price;
  const hasDiscount = discount && discount > 0;

  return (
    <div 
      className="package-card" 
      data-id={id}
      onClick={handleClick}
    >
      <div 
        className="package-card-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
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
          <button className="package-card-btn primary">
            EXPLORAR
          </button>
          <button className="package-card-btn secondary">
            VER PRODUCTOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;