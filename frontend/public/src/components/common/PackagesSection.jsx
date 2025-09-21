import { useNavigate } from 'react-router-dom';
import PackageCard from './PackageCard';
import '../../styles/components/common/PackagesSection.css';

const PackagesSection = () => {
  const navigate = useNavigate();

  const handleVerMas = () => {
    navigate('/paquetes');
  };
  // Mock data de ejemplo
  const packagesData = [
    {
      id: 1,
      name: "Paquete Premium",
      imageUrl: "/images/package-premium.jpg",
      shortDescription: "Todo incluido para eventos de lujo con servicio completo"
    },
    {
      id: 2,
      name: "Paquete Básico",
      imageUrl: "/images/package-basic.jpg", 
      shortDescription: "Esencial para eventos pequeños y familiares"
    },
    {
      id: 3,
      name: "Paquete Empresarial",
      imageUrl: "/images/package-corporate.jpg",
      shortDescription: "Perfecto para eventos corporativos y conferencias"
    },
    {
      id: 4,
      name: "Paquete Bodas",
      imageUrl: "/images/package-wedding.jpg",
      shortDescription: "Especializado en bodas y ceremonias románticas"
    },
    {
      id: 5,
      name: "Paquete Infantil",
      imageUrl: "/images/package-kids.jpg",
      shortDescription: "Diversión garantizada para fiestas infantiles"
    }
  ];

  return (
    <section className="packages-section">
      <div className="packages-container">
        <h2 className="packages-title">Nuestros paquetes</h2>
        
        <div className="packages-grid">
          {packagesData.map((packageInfo) => (
            <PackageCard 
              key={packageInfo.id} 
              packageInfo={packageInfo} 
            />
          ))}
        </div>
        
        <div className="packages-actions">
          <button className="packages-btn-more" onClick={handleVerMas}>
            Ver más
          </button>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;