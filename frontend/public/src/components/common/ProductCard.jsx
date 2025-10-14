import '../../styles/components/common/ProductCard.css';

const ProductCard = ({ productInfo, onClick }) => {
  const { id, name, imageUrl, category, price, description, stock } = productInfo;

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const isOutOfStock = stock === 0;

  // Función para manejar la imagen de respaldo
  const getImageStyle = () => {
    return {
      backgroundImage: `url(${imageUrl || '/images/silla.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  };

  return (
    <div 
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`} 
      data-id={id}
      onClick={handleClick}
    >
      <div 
        className="product-card-image"
        style={getImageStyle()}
      />
      
      <div className="product-card-content">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-description">{description}</p>
        
        <div className="product-card-footer">
          <div className="product-card-price">
            ${price}
            <span className="product-card-price-label">/día</span>
          </div>
          <span className="product-card-stock">
            {isOutOfStock ? 'Sin stock' : `Stock: ${stock}`}
          </span>
        </div>
        
        <div className="product-card-actions">
          <button 
            className="product-card-btn primary"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'No disponible' : 'Rentar'}
          </button>
          <button className="product-card-btn secondary">
            Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;