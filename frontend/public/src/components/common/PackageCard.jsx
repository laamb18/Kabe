import '../../styles/components/common/PackageCard.css';

const PackageCard = ({ packageInfo, onClick }) => {
  const { id, name, imageUrl, shortDescription } = packageInfo;

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

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
        <span className="package-card-category">Paquete</span>
        <h3 className="package-card-name">{name}</h3>
        <p className="package-card-description">{shortDescription}</p>
        
        <div className="package-card-footer">
          <div className="package-card-info">
            <span className="package-card-label">Categoría completa</span>
          </div>
        </div>
        
        <div className="package-card-actions">
          <button className="package-card-btn primary">
            Explorar
          </button>
          <button className="package-card-btn secondary">
            Ver productos
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;