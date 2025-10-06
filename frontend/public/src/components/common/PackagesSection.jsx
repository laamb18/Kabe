import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PackageCard from './PackageCard';
import { categoriasService } from '../../services/api';
import '../../styles/components/common/PackagesSection.css';

const PackagesSection = () => {
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

  const handleVerMas = () => {
    navigate('/paquetes');
  };

  const handleCategoryClick = (categoriaId) => {
    navigate(`/productos?categoria=${categoriaId}`);
  };

  if (loading) {
    return (
      <section className="packages-section">
        <div className="packages-container">
          <h2 className="packages-title">Nuestros Paquetes</h2>
          <div className="loading-message">Cargando paquetes...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="packages-section">
        <div className="packages-container">
          <h2 className="packages-title">Nuestros Paquetes</h2>
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="packages-section">
      <div className="packages-container">
        <h2 className="packages-title">Nuestros Paquetes</h2>
        
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
        
        <div className="packages-actions">
          <button className="packages-btn-more" onClick={handleVerMas}>
            Ver todos los paquetes
          </button>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;