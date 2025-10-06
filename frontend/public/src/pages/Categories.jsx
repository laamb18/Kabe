import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriasService } from '../services/api';
import PackageCard from '../components/common/PackageCard';
import '../styles/pages/Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        setLoading(true);
        const data = await categoriasService.getAll();
        setCategorias(data);
      } catch (err) {
        setError('Error al cargar los paquetes');
        console.error('Error loading categorias:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategorias();
  }, []);

  const handleCategoryClick = (categoriaId) => {
    navigate(`/productos?categoria=${categoriaId}`);
  };

  if (loading) {
    return (
      <div className="categories-page">
        <div className="categories-container">
          <h1 className="categories-title">Nuestros Paquetes</h1>
          <div className="loading-message">Cargando paquetes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-page">
        <div className="categories-container">
          <h1 className="categories-title">Nuestros Paquetes</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
      <div className="categories-page">
        <div className="categories-container">
          <h1 className="categories-title">Nuestros Paquetes</h1>
          <p className="categories-subtitle">
            Explora todos nuestros paquetes de productos para alquiler
          </p>        <div className="categories-grid">
          {categorias.map((categoria) => (
            <div 
              key={categoria.categoria_id} 
              onClick={() => handleCategoryClick(categoria.categoria_id)}
              className="category-item-wrapper"
            >
              <PackageCard 
                packageInfo={{
                  id: categoria.categoria_id,
                  name: categoria.nombre,
                  imageUrl: categoria.imagen_url || "/images/silla.jpg",
                  shortDescription: categoria.descripcion || `Explora nuestra selección de ${categoria.nombre.toLowerCase()}`
                }}
              />
            </div>
          ))}
        </div>
        
        {categorias.length === 0 && (
          <div className="no-categories">
            <p>No hay paquetes disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;