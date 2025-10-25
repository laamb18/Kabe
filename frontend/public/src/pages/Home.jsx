import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSlider from '../components/common/HeroSlider';
import PackagesSection from '../components/common/PackagesSection';
import ProductsSection from '../components/common/ProductsSection';
import AboutSection from '../components/common/AboutSection';
import ContactSection from '../components/common/ContactSection';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // Si se navega con state.scrollTo, hacer scroll a esa sección
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      const element = document.getElementById(sectionId);
      
      if (element) {
        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <HeroSlider/>
      <PackagesSection/>
      <ProductsSection/>
      <AboutSection/>
      <ContactSection/>
    </>
  );
};

export default Home;