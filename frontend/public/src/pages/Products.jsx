import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productosService, categoriasService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import '../styles/pages/Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');

  useEffect(() => {
    // Obtener categoría de la URL si existe
    const categoriaFromUrl = searchParams.get('categoria');
    if (categoriaFromUrl) {
      setCategoriaSeleccionada(categoriaFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productosData, categoriasData] = await Promise.all([
          productosService.getConCategoria(),
          categoriasService.getAll()
        ]);
        
        console.log('Products loaded:', productosData.productos);
        console.log('Sample product with image:', {
          product: productosData.productos[0],
          hasImageUrl: !!productosData.productos[0]?.imagen_url,
          imageUrl: productosData.productos[0]?.imagen_url
        });
        
        setProductos(productosData.productos);
        setCategorias(categoriasData);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const productosFiltrados = categoriaSeleccionada === 'todas' 
    ? productos 
    : productos.filter(p => p.categoria_id === parseInt(categoriaSeleccionada));

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-container">
          <div className="products-header">
            <h1 className="products-title">Nuestros Productos</h1>
            <div className="products-divider"></div>
          </div>
          <div className="products-loading">
            <div className="products-spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="products-container">
          <div className="products-header">
            <h1 className="products-title">Nuestros Productos</h1>
            <div className="products-divider"></div>
          </div>
          <div className="products-error">
            <p>{error}</p>
            <button 
              className="products-retry-btn"
              onClick={() => window.location.reload()}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">Nuestros Productos</h1>
          <div className="products-divider"></div>
          <p className="products-subtitle">
            Encuentra el equipo perfecto para tu evento especial
          </p>
        </div>
        
        {/* Filtros por categoría */}
        <div className="category-filters">
          <button 
            className={categoriaSeleccionada === 'todas' ? 'active' : ''}
            onClick={() => setCategoriaSeleccionada('todas')}
          >
            Todas las categorías
          </button>
          {categorias.map(categoria => (
            <button
              key={categoria.categoria_id}
              className={categoriaSeleccionada === categoria.categoria_id.toString() ? 'active' : ''}
              onClick={() => setCategoriaSeleccionada(categoria.categoria_id.toString())}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="products-grid">
          {productosFiltrados.map(producto => (
            <ProductCard 
              key={producto.producto_id} 
              productInfo={{
                id: producto.producto_id,
                name: producto.nombre,
                description: producto.descripcion,
                price: producto.precio_por_dia,
                stock: producto.stock_disponible,
                category: producto.categoria_nombre,
                imageUrl: producto.imagen_url || '/images/silla.jpg'
              }}
            />
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="products-empty">
            <p>No hay productos disponibles en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;