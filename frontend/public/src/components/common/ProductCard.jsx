import { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';
import '../../styles/components/common/ProductCard.css';

const ProductCard = ({ productInfo }) => {
  const [showModal, setShowModal] = useState(false);
  
  const {
    id,
    name,
    description,
    price,
    stock,
    category,
    imageUrl
  } = productInfo;

  const isOutOfStock = stock === 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div 
        className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
      >
        <div 
          className="product-card-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label={name}
        />
        
        <div className="product-card-content">
          {category && (
            <span className="product-card-category">{category}</span>
          )}
          
          <h3 className="product-card-name">{name}</h3>
          
          {description && (
            <p className="product-card-description">{description}</p>
          )}
          
          <div className="product-card-footer">
            <div>
              <p className="product-card-price">
                {formatPrice(price)}
                <span className="product-card-price-label"> /día</span>
              </p>
            </div>
            
            <span className="product-card-stock">
              {isOutOfStock ? 'Sin stock' : `${stock} disponibles`}
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductDetailModal
          productId={id}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ProductCard;
