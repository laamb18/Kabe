import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productosService } from '../../services/api';
import '../../styles/components/common/ProductsSection.css';

const ProductsSection = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        const data = await productosService.getConCategoria();
        setProductos(data.productos.slice(0, 8)); // Mostrar solo los primeros 8 productos
      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error loading productos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, []);

  const handleVerMas = () => {
    navigate('/productos');
  };

  if (loading) {
    return (
      <section className="products-section">
        <div className="products-container">
          <h2 className="products-title">Nuestros Productos Destacados</h2>
          <div className="loading-message">Cargando productos...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <div className="products-container">
          <h2 className="products-title">Nuestros Productos Destacados</h2>
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="products-container">
        <h2 className="products-title">Nuestros Productos Destacados</h2>
        
        <div className="products-grid">
          {productos.map((producto) => (
            <ProductCard 
              key={producto.producto_id} 
              productInfo={{
                id: producto.producto_id,
                name: producto.nombre,
                imageUrl: producto.imagen_url || "/images/silla.jpg",
                category: producto.categoria_nombre,
                price: producto.precio_por_dia,
                description: producto.descripcion,
                stock: producto.stock_disponible
              }}
            />
          ))}
        </div>
        
        <div className="products-actions">
          <button className="products-btn-more" onClick={handleVerMas}>
            Ver todos los productos
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;