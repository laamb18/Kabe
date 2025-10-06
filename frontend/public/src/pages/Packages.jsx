import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriasService } from '../services/api';
import PackageCard from '../components/common/PackageCard';
import '../styles/pages/Packages.css';

const Packages = () => {
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
      <div className="packages-page">
        <div className="packages-container">
          <div className="packages-header">
            <h1 className="packages-title">Nuestros Paquetes</h1>
            <div className="packages-divider"></div>
          </div>
          <div className="packages-loading">
            <div className="packages-spinner"></div>
            <p>Cargando paquetes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="packages-page">
        <div className="packages-container">
          <div className="packages-header">
            <h1 className="packages-title">Nuestros Paquetes</h1>
            <div className="packages-divider"></div>
          </div>
          <div className="packages-error">
            <p>{error}</p>
            <button 
              className="packages-retry-btn"
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
    <div className="packages-page">
      <div className="packages-container">
        <div className="packages-header">
          <h1 className="packages-title">Nuestros Paquetes</h1>
          <div className="packages-divider"></div>
          <p className="packages-subtitle">
            Descubre nuestras categorías especializadas diseñadas para cada ocasión
          </p>
        </div>
        
        <div className="packages-grid">
          {categorias.map((categoria) => (
            <PackageCard 
              key={categoria.categoria_id} 
              packageInfo={{
                id: categoria.categoria_id,
                name: categoria.nombre,
                imageUrl: categoria.imagen_url || "/images/silla.jpg",
                shortDescription: categoria.descripcion || `Explora nuestra selección de ${categoria.nombre.toLowerCase()}`
              }}
              onClick={handleCategoryClick}
            />
          ))}
        </div>

        {categorias.length === 0 && (
          <div className="packages-empty">
            <p>No hay paquetes disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;