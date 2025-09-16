import '../../styles/components/common/ProductCard.css';

const ProductCard = ({ productInfo }) => {
  const { id, name, imageUrl, category } = productInfo;

  return (
    <div className="product-card" data-id={id}>
      <div 
        className="product-card-circle"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="product-card-overlay" />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-category">{category}</p>
      </div>
    </div>
  );
};

export default ProductCard;