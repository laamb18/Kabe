import ProductCard from './ProductCard';
import '../../styles/components/common/ProductsSection.css';

const ProductsSection = () => {
  // Mock data de ejemplo para productos
  const productsData = [
    {
      id: 1,
      name: "Sillas",
      imageUrl: "/images/product-chairs.jpg",
      category: "Mobiliario"
    },
    {
      id: 2,
      name: "Mesas",
      imageUrl: "/images/product-tables.jpg",
      category: "Mobiliario"
    },
    {
      id: 3,
      name: "Decoración",
      imageUrl: "/images/product-decoration.jpg",
      category: "Ornamental"
    },
    {
      id: 6,
      name: "Carpas",
      imageUrl: "/images/product-tents.jpg",
      category: "Estructuras"
    }
  ];

  return (
    <section className="products-section">
      <div className="products-container">
        <h2 className="products-title">Explora Nuestros Productos</h2>
        
        <div className="products-grid">
          {productsData.map((productInfo) => (
            <ProductCard 
              key={productInfo.id} 
              productInfo={productInfo} 
            />
          ))}
        </div>
        
        <div className="products-actions">
          <button className="products-btn-more">
            ver más
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;