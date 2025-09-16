import './styles/App.css';
import Navbar from './components/common/Navbar'; 
import HeroSlider from './components/common/HeroSlider';
import PackagesSection from './components/common/PackagesSection';
import ProductsSection from './components/common/ProductsSection';
import AboutSection from './components/common/AboutSection';
import ContactSection from './components/common/ContactSection';
import Footer from './components/common/Footer';

function App() {
  return (
    <>
      <Navbar/>
      <HeroSlider/>
      <PackagesSection/>
      <ProductsSection/>
      <AboutSection/>
      <ContactSection/>
      <Footer/>
    </>
  );
}

export default App;