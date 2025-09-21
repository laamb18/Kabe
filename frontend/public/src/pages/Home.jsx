import HeroSlider from '../components/common/HeroSlider';
import PackagesSection from '../components/common/PackagesSection';
import ProductsSection from '../components/common/ProductsSection';
import AboutSection from '../components/common/AboutSection';
import ContactSection from '../components/common/ContactSection';

const Home = () => {
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