import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paquetesService } from '../services/api';
import PackageCard from '../components/common/PackageCard';
import '../styles/pages/Packages.css';

const Packages = () => {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPaquetes = async () => {
      try {
        setLoading(true);
        const data = await paquetesService.getAll();
        
        console.log('Packages loaded:', data);
        console.log('Sample package with image:', {
          package: data[0],
          hasImageUrl: !!data[0]?.imagen_url,
          imageUrl: data[0]?.imagen_url
        });
        
        setPaquetes(data);
      } catch (err) {
        setError('Error al cargar los paquetes');
        console.error('Error loading paquetes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPaquetes();
  }, []);

  const handlePackageClick = (paqueteId) => {
    navigate(`/paquetes/${paqueteId}`);
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
            Descubre nuestros paquetes especializados diseñados para cada ocasión
          </p>
        </div>
        
        <div className="packages-grid">
          {paquetes.map((paquete) => (
            <PackageCard 
              key={paquete.paquete_id} 
              packageInfo={{
                id: paquete.paquete_id,
                name: paquete.nombre,
                imageUrl: paquete.imagen_url || "/images/package-default.jpg",
                shortDescription: paquete.descripcion || `${paquete.nombre} - Paquete completo`,
                price: paquete.precio_por_dia,
                discount: paquete.descuento_porcentaje,
                capacity: paquete.capacidad_personas,
                code: paquete.codigo_paquete
              }}
              onClick={handlePackageClick}
            />
          ))}
        </div>

        {paquetes.length === 0 && (
          <div className="packages-empty">
            <p>No hay paquetes disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;