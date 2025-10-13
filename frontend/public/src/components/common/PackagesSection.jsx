import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PackageCard from './PackageCard';
import { paquetesService } from '../../services/api';
import '../../styles/components/common/PackagesSection.css';

const PackagesSection = () => {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPaquetes = async () => {
      try {
        setLoading(true);
        const data = await paquetesService.getAll();
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

  const handleVerMas = () => {
    navigate('/paquetes');
  };

  const handlePackageClick = (paqueteId) => {
    navigate(`/paquetes/${paqueteId}`);
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