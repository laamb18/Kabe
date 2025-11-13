import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import ProductDetailModal from './ProductDetailModal';
import '../../styles/components/common/ProductCard.css';

const ProductCard = ({ productInfo, onAddToCart }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { agregarItem } = useCarrito();
  
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

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(productInfo);
    } else {
      // Agregar al carrito usando el contexto
      agregarItem(productInfo, 1, 1);
      // Mostrar notificación o navegar al carrito
      const confirmNav = window.confirm('Producto agregado al carrito. ¿Deseas ir al carrito?');
      if (confirmNav) {
        navigate('/carrito');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
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

          <div className="product-card-actions">
            <button 
              className="product-card-btn details"
              onClick={handleDetailsClick}
              aria-label="Ver detalles"
            >
              Ver Detalles
            </button>
            <button 
              className="product-card-btn add-to-cart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label="Agregar al carrito"
            >
              {isOutOfStock ? 'Sin stock' : '🛒 Agregar'}
            </button>
          </div>
        </div>
      </div>

      <ProductDetailModal
        isOpen={showModal}
        productId={id}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ProductCard;
